
var damageCounterRefresh = 0;
function mainLoop() {
    if (!currentArea) {
        return;
    }
    var deltaTime = 20;
    var linesLeft = 200;
    //run other agents code first
    for (var j = 0; j < currentArea.agents.length && linesLeft > 0; j++) {
        var agent = currentArea.agents[j];
        while (isAgentRunningCode(agent) && linesLeft > 0) {
            //restart the agent's loop if it isn't currently running
            if (!agent.executionContext.running) {
                agent.executionContext.runProgram(agent.controlLoop);
            }
            agent.executionContext.runNextLine();
            linesLeft--;
        }
    }
    //run the players code, if any is running
    while (isAgentRunningCode(player) && linesLeft > 0) {
        player.executionContext.runNextLine();
        linesLeft--;
    }
    for (var i = 0; i < player.gameSpeed && linesLeft > 0 && (player.method || player.delay || true); i++) {
        //Mark the passage of time.
        player.time += deltaTime;
        //Passive effects that just happen as time passes
        if (currentArea.loop) {
            currentArea.loop(deltaTime);
        }
        passiveAgentLoop(player, deltaTime);
        currentArea.agents.forEach(function (agent) {
            if (!agent.active) {
                return;
            }
            if (agent.agentType == 'monster') {
                passiveAgentLoop(agent, deltaTime);
            }
        });

        //Active actions taken by agents
        if (player.delay) {
            player.delay = Math.max(0, player.delay - deltaTime);
        } else if (player.method) {
            player.method();
            player.method = null;
        }
        moveAgent(player, deltaTime);
        currentArea.agents.forEach(function (agent) {
            if (!agent.active) {
                return;
            }
            if (agent.delay) {
                agent.delay = Math.max(0, agent.delay - deltaTime);
            } else if (agent.method) {
                agent.method();
                agent.method = null;
            }
            moveAgent(agent, deltaTime);
        });
        player.stateCheck();
        currentArea.agents.forEach(function (agent) {
            if (!agent.active || !agent.stateCheck) {
                return;
            }
            agent.stateCheck(agent);
        });
        uiNeedsUpdate.playerStats = true;
    }
    damageCounterRefresh--;
    showNumericDisplays();
    updateUI();
    checkRemoveToolTip();
}

function passiveAgentLoop(agent, deltaTime) {
    processStatusEffects(agent, deltaTime);
    if (agent.plagueResistance) {
        agent.plagueResistance *= .9999;
    }
    if (agent.agentType == 'player' && agent.inventory.items.coolingMagma > 0) {
        items.coolingMagma.timer -= deltaTime;
        if (items.coolingMagma.timer <= 0) {
            var amountLost = Math.ceil(agent.inventory.items.coolingMagma / 2);
            agent.inventory.items.coolingMagma -= amountLost;
            agent.inventory.items.lavaStone += amountLost;
            uiNeedsUpdate.items = true;
            items.coolingMagma.timer = 30000;
        }
    }
}

/**
 * @param {Agent} agent
 */
function isAgentRunningCode(agent) {
    return agent.active && !agent.delay && !agent.method
        && !agent.executionContext.error
        && (agent.executionContext.running || agent.controlLoop);
}