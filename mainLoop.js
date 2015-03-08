
var damageCounterRefresh = 0;
function mainLoop() {
    if (!currentArea) {
        return;
    }
    var deltaTime = 20;
    var linesLeft = 200;
    for (var i = 0; i < player.gameSpeed && (player.method || player.delay || true); i++) {
        //run other agents code first
        $.each(activeAreas, function (key, area) {
            area.agents.forEach(function (agent) {
                while (isAgentRunningCode(agent) && linesLeft > 0) {
                    //restart the agent's loop if it isn't currently running
                    if (!agent.executionContext.running) {
                        agent.executionContext.runProgram(agent.controlLoop);
                    }
                    agent.executionContext.runNextLine();
                    linesLeft--;
                }
                return linesLeft > 0;
            });
        });
        //run the players code, if any is running
        while (isAgentRunningCode(player) && linesLeft > 0) {
            player.executionContext.runNextLine();
            linesLeft--;
        }
        //Only allow time to pass once all code has completed execution
        if (linesLeft <= 0) {
            break;
        }
        //Mark the passage of time.
        player.time += deltaTime;
        //Passive effects that just happen as time passes
        $.each(activeAreas, function (key, area) {
            if (area.loop) {
                area.loop(deltaTime);
            }
        });
        passiveAgentLoop(player, deltaTime);
        $.each(activeAreas, function (key, area) {
            var isActive = (area == currentArea);
            area.agents.forEach(function (agent) {
                if (!agent.active) {
                    return;
                }
                isActive = true;
                if (agent.agentType == 'monster') {
                    passiveAgentLoop(agent, deltaTime);
                }
            });
            //if no agents are active in this area, remove it from the list of
            //active areas
            if (!isActive) {
                delete activeAreas[area.key];
            }
        });

        //Active actions taken by agents
        if (player.delay) {
            // delays outside of execution context and without actions should be
            // ignored. This is so if you accidentally wait 500s, you cancel when you
            // abort the program.
            if (!player.method && !player.executionContext.running) {
                console.log("aborting wait");
                player.delay = 0;
            }
            player.delay = Math.max(0, player.delay - deltaTime);
        } else if (player.method) {
            player.method();
            player.method = null;
        }
        moveAgent(player, deltaTime);
        $.each(activeAreas, function (key, area) {
            area.agents.forEach(function (agent) {
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
        });
        player.stateCheck();
        $.each(activeAreas, function (key, area) {
            area.agents.forEach(function (agent) {
                if (!agent.active || !agent.stateCheck) {
                    return;
                }
                agent.stateCheck(agent);
            });
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
    return agent.active && !agent.delay && !agent.method && agent.executionContext
        && !agent.executionContext.error
        && (agent.executionContext.running || agent.controlLoop);
}

/*
while 1 {
    while area.turtus {
      attack area.turtus
    }
    while area.brokenShell {
      take area.brokenShell
    }
    while area.smallShell {
      take area.smallShell
    }
    wait .1
}
*/