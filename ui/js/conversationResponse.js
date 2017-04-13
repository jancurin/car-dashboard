/*
 * Copyright © 2016 I.B.M. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the “License”);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* The Intents module contains a list of the possible intents that might be returned by the API */

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^ConversationResponse$" }] */
/* global Animations: true, Api: true, Panel: true */

var ConversationResponse = (function () {
  'use strict';

  return {
    init: init,
    responseHandler: responseHandler
  };

  function init() {
    setupResponseHandling();
  }

  function actionFunctions(action) {
    if(action.cmd === 'music_on') {
      Panel.playMusic(action.arg);
    } else if(action.cmd === 'wipers_on') {// turn on commands
      Animations.wipersOn('lo');
    } else if(action.cmd === 'lights_on') {
      Animations.lightsOn();
    } else if(action.cmd === 'AC_on') {
      Panel.ac('lo');
    } else if(action.cmd === 'heater_on') {
      Panel.heat('lo');
    } else if(action.cmd === 'fan_on') {
      Panel.ac('lo');
    } else if(action.cmd === 'music_off') {//turn off commands
      Panel.setWatsonPanelToDefault();
    } else if(action.cmd === 'wipers_off') {
      Animations.wipersOff();
    } else if(action.cmd === 'lights_off') {
      Animations.lightsOff();
    } else if(action.cmd === 'AC_off') {
      Panel.setWatsonPanelToDefault();
    } else if(action.cmd === 'heater_off') {
      Panel.setWatsonPanelToDefault();
    } else if(action.cmd === 'fan_off') {
      Panel.setWatsonPanelToDefault();
    } else if(action.cmd === 'music_up') {//turn up commands
      Panel.playMusic('general');
    } else if(action.cmd === 'wipers_up') {
      Animations.wipersOn('hi');
    }  else if(action.cmd === 'AC_up') {
      Panel.ac('hi');
    } else if(action.cmd === 'heater_up') {
      Panel.heat('hi');
    } else if(action.cmd === 'fan_up') {
      Panel.ac('hi');
    } else if(action.cmd === 'music_down') {//turn down commands
      Panel.playMusic('general');
    } else if(action.cmd === 'wipers_down') {
      Animations.wipersOn('lo');
    }  else if(action.cmd === 'AC_down') {
      Panel.ac('lo');
    } else if(action.cmd === 'heater_down') {
      Panel.heat('lo');
    } else if(action.cmd === 'fan_down') {
      Panel.ac('lo');
    } else if(action.cmd === 'gas') {// amenity
      Panel.mapGas();
    } else if(action.cmd === 'restaurant') {
      Panel.mapFoodCuisine();
    } else if(action.cmd === 'restroom') {
      Panel.mapRestrooms();
    }
  }

  // Create a callback when a new Watson response is received to handle Watson's response
  function setupResponseHandling() {
    var currentResponsePayloadSetter = Api.setWatsonPayload;
    Api.setWatsonPayload = function (payload) {
      currentResponsePayloadSetter.call(Api, payload);
      responseHandler(payload);
    };
  }



  // Called when a Watson response is received, manages the behavior of the app based
  // on the user intent that was determined by Watson
  function responseHandler(data) {

    let action = data.output.action;

	if (data && data.context) {
		if (data.context.size) {
			document.getElementById("size").value = data.context.size;
		}
		if (data.context.type) {
			document.getElementById("type").value = data.context.type;
		}
		if (data.context.toppings) {
			document.getElementById("toppings").value = data.context.toppings;
		}
		if (data.context.extras) {
			document.getElementById("extras.beer").checked = false;
			document.getElementById("extras.water").checked = false;
			document.getElementById("extras.coke").checked = false;
			document.getElementById("extras.chips").checked = false;
			for (var item in data.context.extras) {
				var item_id = "extras." + data.context.extras[item];
				document.getElementById(item_id).checked = true;
			}
		}

		if (data.context.system && data.context.system.dialog_stack) {

			if (data.context.system.dialog_stack[0].dialog_node == "slot_3_1492075289693") {
				var element = document.getElementById("type");
				var alignWithTop = true;
				element.scrollIntoView(alignWithTop);
			}

			if (data.context.system.dialog_stack[0].dialog_node == "slot_7_1492075361973") {
				//document.getElementById("size").focus();
				var element = document.getElementById("size");
				alignWithTop = true;
				element.scrollIntoView(alignWithTop);
			}

			if (data.context.system.dialog_stack[0].dialog_node == "slot_10_1492075405674") {
				var element = document.getElementById("toppings");
				alignWithTop = true;
				element.scrollIntoView(alignWithTop);
			}

			if (data.context.system.dialog_stack[0].dialog_node == "slot_22_1492076887754") {
				var element = document.getElementById("extras");
				alignWithTop = true;
				element.scrollIntoView(alignWithTop);
			}
		}
	}
	
    if (data && !data.output.error) {
      // Check if message is handled by retrieve and rank and there is no message set
      if (action && !data.output.text) {
        // TODO add EIR link
        data.output.text = ['I am not able to answer that. You can try asking the'
        + ' <a href="https://conversation-with-discovery.mybluemix.net/" target="_blank">Information Retrieval with Discovery App</a>'];

        Api.setWatsonPayload(data);
        return;
      }



      if (action) {
        let actionArray = getActions(action);
        if (actionArray) {
          for (let i in actionArray) {
            if (actionArray.hasOwnProperty(i)) {
              actionFunctions(actionArray[i]);
            }
          }
        }
      }
    }
  }

  function getActions(action) {
    let res = {};

    let cnt = 0;

    for (let key in action) {
      if (action.hasOwnProperty(key)) {
        res[cnt] = {
          cmd: key,
          arg: action[key]
        };
        cnt++;
      }
    }
    return res;
  }
}());