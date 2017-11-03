import { Component, Directive, ElementRef, EventEmitter, HostListener, Inject, Injectable, InjectionToken, Input, NgModule, Output, Renderer } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable as Observable$1 } from 'rxjs/Observable';

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var mousetrap = createCommonjsModule(function (module) {
/*global define:false */
/**
 * Copyright 2012-2017 Craig Campbell
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Mousetrap is a simple keyboard shortcut library for Javascript with
 * no external dependencies
 *
 * @version 1.6.1
 * @url craig.is/killing/mice
 */
(function(window, document, undefined) {

    // Check if mousetrap is used inside browser, if not, return
    if (!window) {
        return;
    }

    /**
     * mapping of special keycodes to their corresponding keys
     *
     * everything in this dictionary cannot use keypress events
     * so it has to be here to map to the correct keycodes for
     * keyup/keydown events
     *
     * @type {Object}
     */
    var _MAP = {
        8: 'backspace',
        9: 'tab',
        13: 'enter',
        16: 'shift',
        17: 'ctrl',
        18: 'alt',
        20: 'capslock',
        27: 'esc',
        32: 'space',
        33: 'pageup',
        34: 'pagedown',
        35: 'end',
        36: 'home',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        45: 'ins',
        46: 'del',
        91: 'meta',
        93: 'meta',
        224: 'meta'
    };

    /**
     * mapping for special characters so they can support
     *
     * this dictionary is only used incase you want to bind a
     * keyup or keydown event to one of these keys
     *
     * @type {Object}
     */
    var _KEYCODE_MAP = {
        106: '*',
        107: '+',
        109: '-',
        110: '.',
        111 : '/',
        186: ';',
        187: '=',
        188: ',',
        189: '-',
        190: '.',
        191: '/',
        192: '`',
        219: '[',
        220: '\\',
        221: ']',
        222: '\''
    };

    /**
     * this is a mapping of keys that require shift on a US keypad
     * back to the non shift equivelents
     *
     * this is so you can use keyup events with these keys
     *
     * note that this will only work reliably on US keyboards
     *
     * @type {Object}
     */
    var _SHIFT_MAP = {
        '~': '`',
        '!': '1',
        '@': '2',
        '#': '3',
        '$': '4',
        '%': '5',
        '^': '6',
        '&': '7',
        '*': '8',
        '(': '9',
        ')': '0',
        '_': '-',
        '+': '=',
        ':': ';',
        '\"': '\'',
        '<': ',',
        '>': '.',
        '?': '/',
        '|': '\\'
    };

    /**
     * this is a list of special strings you can use to map
     * to modifier keys when you specify your keyboard shortcuts
     *
     * @type {Object}
     */
    var _SPECIAL_ALIASES = {
        'option': 'alt',
        'command': 'meta',
        'return': 'enter',
        'escape': 'esc',
        'plus': '+',
        'mod': /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? 'meta' : 'ctrl'
    };

    /**
     * variable to store the flipped version of _MAP from above
     * needed to check if we should use keypress or not when no action
     * is specified
     *
     * @type {Object|undefined}
     */
    var _REVERSE_MAP;

    /**
     * loop through the f keys, f1 to f19 and add them to the map
     * programatically
     */
    for (var i = 1; i < 20; ++i) {
        _MAP[111 + i] = 'f' + i;
    }

    /**
     * loop through to map numbers on the numeric keypad
     */
    for (i = 0; i <= 9; ++i) {

        // This needs to use a string cause otherwise since 0 is falsey
        // mousetrap will never fire for numpad 0 pressed as part of a keydown
        // event.
        //
        // @see https://github.com/ccampbell/mousetrap/pull/258
        _MAP[i + 96] = i.toString();
    }

    /**
     * cross browser add event method
     *
     * @param {Element|HTMLDocument} object
     * @param {string} type
     * @param {Function} callback
     * @returns void
     */
    function _addEvent(object, type, callback) {
        if (object.addEventListener) {
            object.addEventListener(type, callback, false);
            return;
        }

        object.attachEvent('on' + type, callback);
    }

    /**
     * takes the event and returns the key character
     *
     * @param {Event} e
     * @return {string}
     */
    function _characterFromEvent(e) {

        // for keypress events we should return the character as is
        if (e.type == 'keypress') {
            var character = String.fromCharCode(e.which);

            // if the shift key is not pressed then it is safe to assume
            // that we want the character to be lowercase.  this means if
            // you accidentally have caps lock on then your key bindings
            // will continue to work
            //
            // the only side effect that might not be desired is if you
            // bind something like 'A' cause you want to trigger an
            // event when capital A is pressed caps lock will no longer
            // trigger the event.  shift+a will though.
            if (!e.shiftKey) {
                character = character.toLowerCase();
            }

            return character;
        }

        // for non keypress events the special maps are needed
        if (_MAP[e.which]) {
            return _MAP[e.which];
        }

        if (_KEYCODE_MAP[e.which]) {
            return _KEYCODE_MAP[e.which];
        }

        // if it is not in the special map

        // with keydown and keyup events the character seems to always
        // come in as an uppercase character whether you are pressing shift
        // or not.  we should make sure it is always lowercase for comparisons
        return String.fromCharCode(e.which).toLowerCase();
    }

    /**
     * checks if two arrays are equal
     *
     * @param {Array} modifiers1
     * @param {Array} modifiers2
     * @returns {boolean}
     */
    function _modifiersMatch(modifiers1, modifiers2) {
        return modifiers1.sort().join(',') === modifiers2.sort().join(',');
    }

    /**
     * takes a key event and figures out what the modifiers are
     *
     * @param {Event} e
     * @returns {Array}
     */
    function _eventModifiers(e) {
        var modifiers = [];

        if (e.shiftKey) {
            modifiers.push('shift');
        }

        if (e.altKey) {
            modifiers.push('alt');
        }

        if (e.ctrlKey) {
            modifiers.push('ctrl');
        }

        if (e.metaKey) {
            modifiers.push('meta');
        }

        return modifiers;
    }

    /**
     * prevents default for this event
     *
     * @param {Event} e
     * @returns void
     */
    function _preventDefault(e) {
        if (e.preventDefault) {
            e.preventDefault();
            return;
        }

        e.returnValue = false;
    }

    /**
     * stops propogation for this event
     *
     * @param {Event} e
     * @returns void
     */
    function _stopPropagation(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
            return;
        }

        e.cancelBubble = true;
    }

    /**
     * determines if the keycode specified is a modifier key or not
     *
     * @param {string} key
     * @returns {boolean}
     */
    function _isModifier(key) {
        return key == 'shift' || key == 'ctrl' || key == 'alt' || key == 'meta';
    }

    /**
     * reverses the map lookup so that we can look for specific keys
     * to see what can and can't use keypress
     *
     * @return {Object}
     */
    function _getReverseMap() {
        if (!_REVERSE_MAP) {
            _REVERSE_MAP = {};
            for (var key in _MAP) {

                // pull out the numeric keypad from here cause keypress should
                // be able to detect the keys from the character
                if (key > 95 && key < 112) {
                    continue;
                }

                if (_MAP.hasOwnProperty(key)) {
                    _REVERSE_MAP[_MAP[key]] = key;
                }
            }
        }
        return _REVERSE_MAP;
    }

    /**
     * picks the best action based on the key combination
     *
     * @param {string} key - character for key
     * @param {Array} modifiers
     * @param {string=} action passed in
     */
    function _pickBestAction(key, modifiers, action) {

        // if no action was picked in we should try to pick the one
        // that we think would work best for this key
        if (!action) {
            action = _getReverseMap()[key] ? 'keydown' : 'keypress';
        }

        // modifier keys don't work as expected with keypress,
        // switch to keydown
        if (action == 'keypress' && modifiers.length) {
            action = 'keydown';
        }

        return action;
    }

    /**
     * Converts from a string key combination to an array
     *
     * @param  {string} combination like "command+shift+l"
     * @return {Array}
     */
    function _keysFromString(combination) {
        if (combination === '+') {
            return ['+'];
        }

        combination = combination.replace(/\+{2}/g, '+plus');
        return combination.split('+');
    }

    /**
     * Gets info for a specific key combination
     *
     * @param  {string} combination key combination ("command+s" or "a" or "*")
     * @param  {string=} action
     * @returns {Object}
     */
    function _getKeyInfo(combination, action) {
        var keys;
        var key;
        var i;
        var modifiers = [];

        // take the keys from this pattern and figure out what the actual
        // pattern is all about
        keys = _keysFromString(combination);

        for (i = 0; i < keys.length; ++i) {
            key = keys[i];

            // normalize key names
            if (_SPECIAL_ALIASES[key]) {
                key = _SPECIAL_ALIASES[key];
            }

            // if this is not a keypress event then we should
            // be smart about using shift keys
            // this will only work for US keyboards however
            if (action && action != 'keypress' && _SHIFT_MAP[key]) {
                key = _SHIFT_MAP[key];
                modifiers.push('shift');
            }

            // if this key is a modifier then add it to the list of modifiers
            if (_isModifier(key)) {
                modifiers.push(key);
            }
        }

        // depending on what the key combination is
        // we will try to pick the best event for it
        action = _pickBestAction(key, modifiers, action);

        return {
            key: key,
            modifiers: modifiers,
            action: action
        };
    }

    function _belongsTo(element, ancestor) {
        if (element === null || element === document) {
            return false;
        }

        if (element === ancestor) {
            return true;
        }

        return _belongsTo(element.parentNode, ancestor);
    }

    function Mousetrap(targetElement) {
        var self = this;

        targetElement = targetElement || document;

        if (!(self instanceof Mousetrap)) {
            return new Mousetrap(targetElement);
        }

        /**
         * element to attach key events to
         *
         * @type {Element}
         */
        self.target = targetElement;

        /**
         * a list of all the callbacks setup via Mousetrap.bind()
         *
         * @type {Object}
         */
        self._callbacks = {};

        /**
         * direct map of string combinations to callbacks used for trigger()
         *
         * @type {Object}
         */
        self._directMap = {};

        /**
         * keeps track of what level each sequence is at since multiple
         * sequences can start out with the same sequence
         *
         * @type {Object}
         */
        var _sequenceLevels = {};

        /**
         * variable to store the setTimeout call
         *
         * @type {null|number}
         */
        var _resetTimer;

        /**
         * temporary state where we will ignore the next keyup
         *
         * @type {boolean|string}
         */
        var _ignoreNextKeyup = false;

        /**
         * temporary state where we will ignore the next keypress
         *
         * @type {boolean}
         */
        var _ignoreNextKeypress = false;

        /**
         * are we currently inside of a sequence?
         * type of action ("keyup" or "keydown" or "keypress") or false
         *
         * @type {boolean|string}
         */
        var _nextExpectedAction = false;

        /**
         * resets all sequence counters except for the ones passed in
         *
         * @param {Object} doNotReset
         * @returns void
         */
        function _resetSequences(doNotReset) {
            doNotReset = doNotReset || {};

            var activeSequences = false,
                key;

            for (key in _sequenceLevels) {
                if (doNotReset[key]) {
                    activeSequences = true;
                    continue;
                }
                _sequenceLevels[key] = 0;
            }

            if (!activeSequences) {
                _nextExpectedAction = false;
            }
        }

        /**
         * finds all callbacks that match based on the keycode, modifiers,
         * and action
         *
         * @param {string} character
         * @param {Array} modifiers
         * @param {Event|Object} e
         * @param {string=} sequenceName - name of the sequence we are looking for
         * @param {string=} combination
         * @param {number=} level
         * @returns {Array}
         */
        function _getMatches(character, modifiers, e, sequenceName, combination, level) {
            var i;
            var callback;
            var matches = [];
            var action = e.type;

            // if there are no events related to this keycode
            if (!self._callbacks[character]) {
                return [];
            }

            // if a modifier key is coming up on its own we should allow it
            if (action == 'keyup' && _isModifier(character)) {
                modifiers = [character];
            }

            // loop through all callbacks for the key that was pressed
            // and see if any of them match
            for (i = 0; i < self._callbacks[character].length; ++i) {
                callback = self._callbacks[character][i];

                // if a sequence name is not specified, but this is a sequence at
                // the wrong level then move onto the next match
                if (!sequenceName && callback.seq && _sequenceLevels[callback.seq] != callback.level) {
                    continue;
                }

                // if the action we are looking for doesn't match the action we got
                // then we should keep going
                if (action != callback.action) {
                    continue;
                }

                // if this is a keypress event and the meta key and control key
                // are not pressed that means that we need to only look at the
                // character, otherwise check the modifiers as well
                //
                // chrome will not fire a keypress if meta or control is down
                // safari will fire a keypress if meta or meta+shift is down
                // firefox will fire a keypress if meta or control is down
                if ((action == 'keypress' && !e.metaKey && !e.ctrlKey) || _modifiersMatch(modifiers, callback.modifiers)) {

                    // when you bind a combination or sequence a second time it
                    // should overwrite the first one.  if a sequenceName or
                    // combination is specified in this call it does just that
                    //
                    // @todo make deleting its own method?
                    var deleteCombo = !sequenceName && callback.combo == combination;
                    var deleteSequence = sequenceName && callback.seq == sequenceName && callback.level == level;
                    if (deleteCombo || deleteSequence) {
                        self._callbacks[character].splice(i, 1);
                    }

                    matches.push(callback);
                }
            }

            return matches;
        }

        /**
         * actually calls the callback function
         *
         * if your callback function returns false this will use the jquery
         * convention - prevent default and stop propogation on the event
         *
         * @param {Function} callback
         * @param {Event} e
         * @returns void
         */
        function _fireCallback(callback, e, combo, sequence) {

            // if this event should not happen stop here
            if (self.stopCallback(e, e.target || e.srcElement, combo, sequence)) {
                return;
            }

            if (callback(e, combo) === false) {
                _preventDefault(e);
                _stopPropagation(e);
            }
        }

        /**
         * handles a character key event
         *
         * @param {string} character
         * @param {Array} modifiers
         * @param {Event} e
         * @returns void
         */
        self._handleKey = function(character, modifiers, e) {
            var callbacks = _getMatches(character, modifiers, e);
            var i;
            var doNotReset = {};
            var maxLevel = 0;
            var processedSequenceCallback = false;

            // Calculate the maxLevel for sequences so we can only execute the longest callback sequence
            for (i = 0; i < callbacks.length; ++i) {
                if (callbacks[i].seq) {
                    maxLevel = Math.max(maxLevel, callbacks[i].level);
                }
            }

            // loop through matching callbacks for this key event
            for (i = 0; i < callbacks.length; ++i) {

                // fire for all sequence callbacks
                // this is because if for example you have multiple sequences
                // bound such as "g i" and "g t" they both need to fire the
                // callback for matching g cause otherwise you can only ever
                // match the first one
                if (callbacks[i].seq) {

                    // only fire callbacks for the maxLevel to prevent
                    // subsequences from also firing
                    //
                    // for example 'a option b' should not cause 'option b' to fire
                    // even though 'option b' is part of the other sequence
                    //
                    // any sequences that do not match here will be discarded
                    // below by the _resetSequences call
                    if (callbacks[i].level != maxLevel) {
                        continue;
                    }

                    processedSequenceCallback = true;

                    // keep a list of which sequences were matches for later
                    doNotReset[callbacks[i].seq] = 1;
                    _fireCallback(callbacks[i].callback, e, callbacks[i].combo, callbacks[i].seq);
                    continue;
                }

                // if there were no sequence matches but we are still here
                // that means this is a regular match so we should fire that
                if (!processedSequenceCallback) {
                    _fireCallback(callbacks[i].callback, e, callbacks[i].combo);
                }
            }

            // if the key you pressed matches the type of sequence without
            // being a modifier (ie "keyup" or "keypress") then we should
            // reset all sequences that were not matched by this event
            //
            // this is so, for example, if you have the sequence "h a t" and you
            // type "h e a r t" it does not match.  in this case the "e" will
            // cause the sequence to reset
            //
            // modifier keys are ignored because you can have a sequence
            // that contains modifiers such as "enter ctrl+space" and in most
            // cases the modifier key will be pressed before the next key
            //
            // also if you have a sequence such as "ctrl+b a" then pressing the
            // "b" key will trigger a "keypress" and a "keydown"
            //
            // the "keydown" is expected when there is a modifier, but the
            // "keypress" ends up matching the _nextExpectedAction since it occurs
            // after and that causes the sequence to reset
            //
            // we ignore keypresses in a sequence that directly follow a keydown
            // for the same character
            var ignoreThisKeypress = e.type == 'keypress' && _ignoreNextKeypress;
            if (e.type == _nextExpectedAction && !_isModifier(character) && !ignoreThisKeypress) {
                _resetSequences(doNotReset);
            }

            _ignoreNextKeypress = processedSequenceCallback && e.type == 'keydown';
        };

        /**
         * handles a keydown event
         *
         * @param {Event} e
         * @returns void
         */
        function _handleKeyEvent(e) {

            // normalize e.which for key events
            // @see http://stackoverflow.com/questions/4285627/javascript-keycode-vs-charcode-utter-confusion
            if (typeof e.which !== 'number') {
                e.which = e.keyCode;
            }

            var character = _characterFromEvent(e);

            // no character found then stop
            if (!character) {
                return;
            }

            // need to use === for the character check because the character can be 0
            if (e.type == 'keyup' && _ignoreNextKeyup === character) {
                _ignoreNextKeyup = false;
                return;
            }

            self.handleKey(character, _eventModifiers(e), e);
        }

        /**
         * called to set a 1 second timeout on the specified sequence
         *
         * this is so after each key press in the sequence you have 1 second
         * to press the next key before you have to start over
         *
         * @returns void
         */
        function _resetSequenceTimer() {
            clearTimeout(_resetTimer);
            _resetTimer = setTimeout(_resetSequences, 1000);
        }

        /**
         * binds a key sequence to an event
         *
         * @param {string} combo - combo specified in bind call
         * @param {Array} keys
         * @param {Function} callback
         * @param {string=} action
         * @returns void
         */
        function _bindSequence(combo, keys, callback, action) {

            // start off by adding a sequence level record for this combination
            // and setting the level to 0
            _sequenceLevels[combo] = 0;

            /**
             * callback to increase the sequence level for this sequence and reset
             * all other sequences that were active
             *
             * @param {string} nextAction
             * @returns {Function}
             */
            function _increaseSequence(nextAction) {
                return function() {
                    _nextExpectedAction = nextAction;
                    ++_sequenceLevels[combo];
                    _resetSequenceTimer();
                };
            }

            /**
             * wraps the specified callback inside of another function in order
             * to reset all sequence counters as soon as this sequence is done
             *
             * @param {Event} e
             * @returns void
             */
            function _callbackAndReset(e) {
                _fireCallback(callback, e, combo);

                // we should ignore the next key up if the action is key down
                // or keypress.  this is so if you finish a sequence and
                // release the key the final key will not trigger a keyup
                if (action !== 'keyup') {
                    _ignoreNextKeyup = _characterFromEvent(e);
                }

                // weird race condition if a sequence ends with the key
                // another sequence begins with
                setTimeout(_resetSequences, 10);
            }

            // loop through keys one at a time and bind the appropriate callback
            // function.  for any key leading up to the final one it should
            // increase the sequence. after the final, it should reset all sequences
            //
            // if an action is specified in the original bind call then that will
            // be used throughout.  otherwise we will pass the action that the
            // next key in the sequence should match.  this allows a sequence
            // to mix and match keypress and keydown events depending on which
            // ones are better suited to the key provided
            for (var i = 0; i < keys.length; ++i) {
                var isFinal = i + 1 === keys.length;
                var wrappedCallback = isFinal ? _callbackAndReset : _increaseSequence(action || _getKeyInfo(keys[i + 1]).action);
                _bindSingle(keys[i], wrappedCallback, action, combo, i);
            }
        }

        /**
         * binds a single keyboard combination
         *
         * @param {string} combination
         * @param {Function} callback
         * @param {string=} action
         * @param {string=} sequenceName - name of sequence if part of sequence
         * @param {number=} level - what part of the sequence the command is
         * @returns void
         */
        function _bindSingle(combination, callback, action, sequenceName, level) {

            // store a direct mapped reference for use with Mousetrap.trigger
            self._directMap[combination + ':' + action] = callback;

            // make sure multiple spaces in a row become a single space
            combination = combination.replace(/\s+/g, ' ');

            var sequence = combination.split(' ');
            var info;

            // if this pattern is a sequence of keys then run through this method
            // to reprocess each pattern one key at a time
            if (sequence.length > 1) {
                _bindSequence(combination, sequence, callback, action);
                return;
            }

            info = _getKeyInfo(combination, action);

            // make sure to initialize array if this is the first time
            // a callback is added for this key
            self._callbacks[info.key] = self._callbacks[info.key] || [];

            // remove an existing match if there is one
            _getMatches(info.key, info.modifiers, {type: info.action}, sequenceName, combination, level);

            // add this call back to the array
            // if it is a sequence put it at the beginning
            // if not put it at the end
            //
            // this is important because the way these are processed expects
            // the sequence ones to come first
            self._callbacks[info.key][sequenceName ? 'unshift' : 'push']({
                callback: callback,
                modifiers: info.modifiers,
                action: info.action,
                seq: sequenceName,
                level: level,
                combo: combination
            });
        }

        /**
         * binds multiple combinations to the same callback
         *
         * @param {Array} combinations
         * @param {Function} callback
         * @param {string|undefined} action
         * @returns void
         */
        self._bindMultiple = function(combinations, callback, action) {
            for (var i = 0; i < combinations.length; ++i) {
                _bindSingle(combinations[i], callback, action);
            }
        };

        // start!
        _addEvent(targetElement, 'keypress', _handleKeyEvent);
        _addEvent(targetElement, 'keydown', _handleKeyEvent);
        _addEvent(targetElement, 'keyup', _handleKeyEvent);
    }

    /**
     * binds an event to mousetrap
     *
     * can be a single key, a combination of keys separated with +,
     * an array of keys, or a sequence of keys separated by spaces
     *
     * be sure to list the modifier keys first to make sure that the
     * correct key ends up getting bound (the last key in the pattern)
     *
     * @param {string|Array} keys
     * @param {Function} callback
     * @param {string=} action - 'keypress', 'keydown', or 'keyup'
     * @returns void
     */
    Mousetrap.prototype.bind = function(keys, callback, action) {
        var self = this;
        keys = keys instanceof Array ? keys : [keys];
        self._bindMultiple.call(self, keys, callback, action);
        return self;
    };

    /**
     * unbinds an event to mousetrap
     *
     * the unbinding sets the callback function of the specified key combo
     * to an empty function and deletes the corresponding key in the
     * _directMap dict.
     *
     * TODO: actually remove this from the _callbacks dictionary instead
     * of binding an empty function
     *
     * the keycombo+action has to be exactly the same as
     * it was defined in the bind method
     *
     * @param {string|Array} keys
     * @param {string} action
     * @returns void
     */
    Mousetrap.prototype.unbind = function(keys, action) {
        var self = this;
        return self.bind.call(self, keys, function() {}, action);
    };

    /**
     * triggers an event that has already been bound
     *
     * @param {string} keys
     * @param {string=} action
     * @returns void
     */
    Mousetrap.prototype.trigger = function(keys, action) {
        var self = this;
        if (self._directMap[keys + ':' + action]) {
            self._directMap[keys + ':' + action]({}, keys);
        }
        return self;
    };

    /**
     * resets the library back to its initial state.  this is useful
     * if you want to clear out the current keyboard shortcuts and bind
     * new ones - for example if you switch to another page
     *
     * @returns void
     */
    Mousetrap.prototype.reset = function() {
        var self = this;
        self._callbacks = {};
        self._directMap = {};
        return self;
    };

    /**
     * should we stop this event before firing off callbacks
     *
     * @param {Event} e
     * @param {Element} element
     * @return {boolean}
     */
    Mousetrap.prototype.stopCallback = function(e, element) {
        var self = this;

        // if the element has the class "mousetrap" then no need to stop
        if ((' ' + element.className + ' ').indexOf(' mousetrap ') > -1) {
            return false;
        }

        if (_belongsTo(element, self.target)) {
            return false;
        }

        // stop for input, select, and textarea
        return element.tagName == 'INPUT' || element.tagName == 'SELECT' || element.tagName == 'TEXTAREA' || element.isContentEditable;
    };

    /**
     * exposes _handleKey publicly so it can be overwritten by extensions
     */
    Mousetrap.prototype.handleKey = function() {
        var self = this;
        return self._handleKey.apply(self, arguments);
    };

    /**
     * allow custom key mappings
     */
    Mousetrap.addKeycodes = function(object) {
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                _MAP[key] = object[key];
            }
        }
        _REVERSE_MAP = null;
    };

    /**
     * Init the global mousetrap functions
     *
     * This method is needed to allow the global mousetrap functions to work
     * now that mousetrap is a constructor function.
     */
    Mousetrap.init = function() {
        var documentMousetrap = Mousetrap(document);
        for (var method in documentMousetrap) {
            if (method.charAt(0) !== '_') {
                Mousetrap[method] = (function(method) {
                    return function() {
                        return documentMousetrap[method].apply(documentMousetrap, arguments);
                    };
                } (method));
            }
        }
    };

    Mousetrap.init();

    // expose mousetrap to the global object
    window.Mousetrap = Mousetrap;

    // expose as a common js module
    if ('object' !== 'undefined' && module.exports) {
        module.exports = Mousetrap;
    }

    // expose mousetrap as an AMD module
    if (typeof undefined === 'function' && undefined.amd) {
        undefined(function() {
            return Mousetrap;
        });
    }
}) (typeof window !== 'undefined' ? window : null, typeof  window !== 'undefined' ? document : null);
});

/*
 The MIT License (MIT)

 Copyright (c) 2017 Stefano Cappa (Ks89)

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */
/**
 * Service to intercept ctrl+s (or cmd+s on macOS) using a third-party library, called Mousetrap.
 */
class KeyboardService {
    /**
     * @param {?} config
     */
    constructor(config) {
        this.config = config;
        this.shortcuts = this.config && this.config.shortcuts ? this.config.shortcuts : ['ctrl+s', 'meta+s'];
        this.mousetrap = new Mousetrap();
    }
    /**
     * Method to add a lister for ctrl+s/cmd+s keyboard events.
     * @param {?} onBind Callback function
     * @return {?}
     */
    add(onBind) {
        this.mousetrap.bind(this.shortcuts, (event, combo) => {
            if (event.preventDefault) {
                event.preventDefault();
            }
            else {
                // internet explorer
                event.returnValue = false;
            }
            onBind(event, combo);
        });
    }
    /**
     * Useful function to reset all listeners. Please, call this function when needed
     * to free resources ad prevent leaks.
     * @return {?}
     */
    reset() {
        this.mousetrap.reset();
    }
}
KeyboardService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
KeyboardService.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [KEYBOARD_CONFIGURATION,] },] },
];

/*
 The MIT License (MIT)

 Copyright (c) 2017 Stefano Cappa (Ks89)
 Copyright (c) 2016 vimalavinisha (only for version 1)

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */
let Action = {};
Action.NORMAL = 0;
Action.CLICK = 1;
Action.KEYBOARD = 2;
Action.SWIPE = 3;
Action.LOAD = 4;
Action[Action.NORMAL] = "NORMAL";
Action[Action.CLICK] = "CLICK";
Action[Action.KEYBOARD] = "KEYBOARD";
Action[Action.SWIPE] = "SWIPE";
Action[Action.LOAD] = "LOAD";
/**
 * Class `ImageModalEvent` that represents the Event after an action `action` and its result.
 */
class ImageModalEvent {
    /**
     * @param {?} action
     * @param {?} result
     */
    constructor(action, result) {
        this.action = action;
        this.result = result;
    }
}
/**
 * Class `Image` that represents an Image with both images and thumb paths,
 * also with a description and an external url.
 * The only required value is the image path `img`.
 */
class Image {
    /**
     * @param {?} img
     * @param {?=} thumb
     * @param {?=} description
     * @param {?=} extUrl
     */
    constructor(img, thumb, description, extUrl) {
        this.img = img;
        this.thumb = thumb;
        this.description = description;
        this.extUrl = extUrl;
    }
}
let Keyboard = {};
Keyboard.ESC = 27;
Keyboard.LEFT_ARROW = 37;
Keyboard.RIGHT_ARROW = 39;
Keyboard.UP_ARROW = 38;
Keyboard.DOWN_ARROW = 40;
Keyboard[Keyboard.ESC] = "ESC";
Keyboard[Keyboard.LEFT_ARROW] = "LEFT_ARROW";
Keyboard[Keyboard.RIGHT_ARROW] = "RIGHT_ARROW";
Keyboard[Keyboard.UP_ARROW] = "UP_ARROW";
Keyboard[Keyboard.DOWN_ARROW] = "DOWN_ARROW";
/**
 * Main Component of this library with the modal gallery.
 */
class AngularModalGalleryComponent {
    /**
     * Constructor with the injection of ´KeyboardService´ that initialize some description fields
     * based on default values.
     * @param {?} keyboardService
     */
    constructor(keyboardService) {
        this.keyboardService = keyboardService;
        /**
         * Boolean required to enable image download with both ctrl+s/cmd+s and download button.
         * If you want to show enable button, this is not enough. You have to use also `buttonsConfig`.
         */
        this.downloadable = false;
        /**
         * enableCloseOutside's input to enable modal-gallery close's behaviour while clicking
         * on the semi-transparent background. Disabled by default.
         */
        this.enableCloseOutside = false;
        /**
         * DEPRECATED
         * -----REMOVE THIS IN 4.0.0----- deprecated both showDownloadButton and showExtUrlButton
         */
        this.showDownloadButton = false;
        /**
         * DEPRECATED
         * -----REMOVE THIS IN 4.0.0----- deprecated both showDownloadButton and showExtUrlButton
         */
        this.showExtUrlButton = false; // deprecated
        this.close = new EventEmitter();
        this.show = new EventEmitter();
        this.firstImage = new EventEmitter();
        this.lastImage = new EventEmitter();
        this.hasData = new EventEmitter();
        /**
         * Boolean that it is true if the modal gallery is visible
         */
        this.opened = false;
        /**
         * Boolean that it is true if an image of the modal gallery is still loading
         */
        this.loading = false;
        /**
         * Boolean to open the modal gallery. Closed by default.
         */
        this.showGallery = false;
        /**
         * Number that represents the index of the current image.
         */
        this.currentImageIndex = 0;
        /**
         * Enum of type `Action` used to pass a click action when you click on the modal image.
         * Declared here to be used inside the template.
         */
        this.clickAction = Action.CLICK;
        /**
         * Boolean that it's true when you are watching the first image (currently visible).
         */
        this.isFirstImage = false;
        /**
         * Boolean that it's true when you are watching the last image (currently visible).
         */
        this.isLastImage = false;
        /**
         * Private SWIPE_ACTION to define all swipe actions used by hammerjs.
         */
        this.SWIPE_ACTION = {
            LEFT: 'swipeleft',
            RIGHT: 'swiperight',
            UP: 'swipeup',
            DOWN: 'swipedown'
        };
        // if description isn't provided initialize it with a default object
        if (!this.description) {
            this.description = {
                imageText: 'Image ',
                numberSeparator: '/',
                beforeTextDescription: ' - '
            };
        }
        // if one of the Description fields isn't initialized, provide a default value
        this.description.imageText = this.description.imageText || 'Image ';
        this.description.numberSeparator = this.description.numberSeparator || '/';
        this.description.beforeTextDescription = this.description.beforeTextDescription || ' - ';
    }
    /**
     * Listener to catch keyboard's events and call the right method based on the key.
     * For instance, pressing esc, this will call `closeGallery(Action.KEYBOARD)` and so on.
     * If you passed a valid `keyboardConfig` esc, right and left buttons will be customized based on your data.
     * @param {?} e KeyboardEvent caught by the listener.
     * @return {?}
     */
    onKeyDown(e) {
        if (!this.opened) {
            return;
        }
        const /** @type {?} */ esc = this.keyboardConfig && this.keyboardConfig.esc ? this.keyboardConfig.esc : Keyboard.ESC;
        const /** @type {?} */ right = this.keyboardConfig && this.keyboardConfig.right ? this.keyboardConfig.right : Keyboard.RIGHT_ARROW;
        const /** @type {?} */ left = this.keyboardConfig && this.keyboardConfig.left ? this.keyboardConfig.left : Keyboard.LEFT_ARROW;
        switch (e.keyCode) {
            case esc:
                this.closeGallery(Action.KEYBOARD);
                break;
            case right:
                this.nextImage(Action.KEYBOARD);
                break;
            case left:
                this.prevImage(Action.KEYBOARD);
                break;
        }
    }
    /**
     * Method ´ngOnInit´ to build `configButtons` and to call `initImages()`.
     * This is an Angular's lifecycle hook, so its called automatically by Angular itself.
     * In particular, it's called only one time!!!
     * @return {?}
     */
    ngOnInit() {
        // build configButtons to use it inside upper-buttons
        this.configButtons = {
            download: this.showDownloadButton || (this.buttonsConfig && this.buttonsConfig.download),
            extUrl: this.showExtUrlButton || (this.buttonsConfig && this.buttonsConfig.extUrl),
            close: (this.buttonsConfig && this.buttonsConfig.close)
        };
        // call initImages passing true as parameter, because I want to emit `hasData` event
        this.initImages(true);
    }
    /**
     * Method ´ngOnChanges´ to init images preventing errors.
     * This is an Angular's lifecycle hook, so its called automatically by Angular itself.
     * In particular, it's called before `ngOnInit()` and whenever one or more data-bound input properties change.
     * @param {?} changes `SimpleChanges` object of current and previous property values provided by Angular.
     * @return {?}
     */
    ngOnChanges(changes) {
        // to prevent errors when you pass to this library
        // the array of images inside a subscribe block, in this way: `...subscribe(val => { this.images = arrayOfImages })`
        // As you can see, I'm providing examples in these situations in all official demos
        if (this.modalImages) {
            // I pass `false` as parameter, because I DON'T want to emit `hasData`
            // event (preventing multiple hasData events while initializing)
            this.initImages(false);
        }
    }
    /**
     * Method `getDescriptionToDisplay` to get the image description based on input params.
     * If you provide a full description this will be the visible description, otherwise,
     * it will be built using the `description` object, concatenating its fields.
     * @return {?} String description to display.
     */
    getDescriptionToDisplay() {
        if (this.description && this.description.customFullDescription) {
            return this.description.customFullDescription;
        }
        // If the current image hasn't a description,
        // prevent to write the ' - ' (or this.description.beforeTextDescription)
        if (!this.currentImage.description || this.currentImage.description === '') {
            return `${this.description.imageText}${this.currentImageIndex + 1}${this.description.numberSeparator}${this.images.length}`;
        }
        return `${this.description.imageText}${this.currentImageIndex + 1}${this.description.numberSeparator}${this.images.length}${this.description.beforeTextDescription}${this.currentImage.description}`;
    }
    /**
     * Method `swipe` used by Hammerjs to support touch gestures.
     * @param {?} index Number that represent the current visible index
     * @param {?=} action String that represent the direction of the swipe action. 'swiperight' by default.
     * @return {?}
     */
    swipe(index, action = this.SWIPE_ACTION.RIGHT) {
        switch (action) {
            case this.SWIPE_ACTION.RIGHT:
                this.nextImage(Action.SWIPE);
                break;
            case this.SWIPE_ACTION.LEFT:
                this.prevImage(Action.SWIPE);
                break;
        }
    }
    /**
     * Method `closeGallery` to close the modal gallery.
     * @param {?=} action Enum of type `Action` that represents the source
     *  action that closed the modal gallery. NORMAL by default.
     * @return {?}
     */
    closeGallery(action = Action.NORMAL) {
        this.close.emit(new ImageModalEvent(action, true));
        this.opened = false;
        this.keyboardService.reset();
    }
    /**
     * Method `prevImage` to go back to the previous image shown into the modal gallery.
     * @param {?=} action Enum of type `Action` that represents the source
     *  action that moved back to the previous image. NORMAL by default.
     * @return {?}
     */
    prevImage(action = Action.NORMAL) {
        // check if prevImage should be blocked
        if (this.isPreventSliding(0)) {
            return;
        }
        this.loading = true;
        this.currentImageIndex = this.getPrevIndex(action, this.currentImageIndex);
        this.showModalGallery(this.currentImageIndex);
    }
    /**
     * Method `nextImage` to go back to the previous image shown into the modal gallery.
     * @param {?=} action Enum of type `Action` that represents the source
     *  action that moved to the next image. NORMAL by default.
     * @return {?}
     */
    nextImage(action = Action.NORMAL) {
        // check if nextImage should be blocked
        if (this.isPreventSliding(this.images.length - 1)) {
            return;
        }
        this.loading = true;
        this.currentImageIndex = this.getNextIndex(action, this.currentImageIndex);
        this.showModalGallery(this.currentImageIndex);
    }
    /**
     * Method `onShowModalGallery` called when you click on an image of your gallery.
     * The input index is the index of the clicked image thumb.
     * @param {?} index Number that represents the index of the clicked image.
     * @return {?}
     */
    onShowModalGallery(index) {
        this.showModalGallery(index);
    }
    /**
     * Method `showModalGallery` to show the modal gallery displaying the image with
     * the index specified as input parameter.
     * It will also register a new `keyboardService` to catch keyboard's events to download the current
     * image with keyboard's shortcuts. This service, will be removed when modal gallery component will be destroyed.
     * @param {?} index Number that represents the index of the image to show.
     * @return {?}
     */
    showModalGallery(index) {
        this.keyboardService.add((event, combo) => {
            if (event.preventDefault) {
                event.preventDefault();
            }
            else {
                // internet explorer
                event.returnValue = false;
            }
            this.downloadImage();
        });
        // enable/disable 'infinite sliding' based on @Input() slideConfig
        this.manageSlideConfig(index);
        this.currentImageIndex = index;
        this.opened = true;
        this.currentImage = this.images[this.currentImageIndex];
        this.loading = false;
        // emit current visible image index
        this.show.emit(new ImageModalEvent(Action.LOAD, this.currentImageIndex + 1));
    }
    /**
     * Method `downloadImage` to download the current visible image, only if `downloadable` is true.
     * For IE, this will navigate to the image instead of a direct download as in all modern browsers.
     * @return {?}
     */
    downloadImage() {
        if (!this.downloadable) {
            return;
        }
        // for all browsers
        // Attention: with IE is not working, but it will navigate to the image
        let /** @type {?} */ link = document.createElement('a');
        link.href = this.currentImage.img;
        link.setAttribute('download', this.getFileName(this.currentImage.img));
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    /**
     * Method `onClickOutside` to close modal gallery when both `enableCloseOutside` is true and user
     * clicked on the semi-transparent background around the image.
     * @param {?} event Boolean that is true if user clicked on the semi-transparent background, false otherwise.
     * @return {?}
     */
    onClickOutside(event) {
        if (event && this.enableCloseOutside) {
            this.closeGallery(Action.CLICK);
        }
    }
    /**
     * Method to get `alt attribute`.
     * `alt` specifies an alternate text for an image, if the image cannot be displayed.
     * There is a similar version of this method into `gallery.component.ts` that
     * receives the image index as input.
     * @param {?} currentImage Image that represents the current visible image.
     * @return {?}
     */
    getAltDescriptionByImage(currentImage) {
        if (!currentImage) {
            return '';
        }
        if (!currentImage.description) {
            return `Image ${this.images.indexOf(currentImage)}`;
        }
        return currentImage.description;
    }
    /**
     * Method `ngOnDestroy` to cleanup resources. In fact, this will unsubscribe
     * all subscriptions and it will reset keyboard's service.
     * @return {?}
     */
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.keyboardService.reset();
    }
    /**
     * Private method `getNextIndex` to get the next index, based on the action and the current index.
     * This is necessary because at the end, when you call next again, you'll go to the first image.
     * That happens because all modal images are shown like in a circle.
     * @param {?} action Enum of type Action that represents the source of the event that changed the
     *  current image to the next one.
     * @param {?} currentIndex Number that represents the current index of the visible image.
     * @return {?}
     */
    getNextIndex(action, currentIndex) {
        let /** @type {?} */ newIndex = 0;
        if (currentIndex >= 0 && currentIndex < this.images.length - 1) {
            newIndex = currentIndex + 1;
        }
        else {
            newIndex = 0; // start from the first index
        }
        // emit first/last event based on newIndex value
        this.emitBoundaryEvent(action, newIndex);
        // emit current visible image index
        this.show.emit(new ImageModalEvent(action, currentIndex + 1));
        return newIndex;
    }
    /**
     * Private method `getPrevIndex` to get the previous index, based on the action and the current index.
     * This is necessary because at index 0, when you call prev again, you'll go to the last image.
     * That happens because all modal images are shown like in a circle.
     * @param {?} action Enum of type Action that represents the source of the event that changed the
     *  current image to the previous one.
     * @param {?} currentIndex Number that represents the current index of the visible image.
     * @return {?}
     */
    getPrevIndex(action, currentIndex) {
        let /** @type {?} */ newIndex = 0;
        if (currentIndex > 0 && currentIndex <= this.images.length - 1) {
            newIndex = currentIndex - 1;
        }
        else {
            newIndex = this.images.length - 1; // start from the last index
        }
        // emit first/last event based on newIndex value
        this.emitBoundaryEvent(action, newIndex);
        // emit current visible image index
        this.show.emit(new ImageModalEvent(action, currentIndex + 1));
        return newIndex;
    }
    /**
     * Private method ´initImages´ to initialize `images` as array of `Image` or as an
     * Observable of `Array<Image>`. Also, it will call completeInitialization.
     * @param {?=} emitHasDataEvent boolean to emit `hasData` event while initializing `angular-modal-gallery`.
     *  Use this parameter to prevent multiple `hasData` events.
     * @return {?}
     */
    initImages(emitHasDataEvent = false) {
        if (this.modalImages instanceof Array) {
            this.images = (this.modalImages);
            this.completeInitialization(emitHasDataEvent);
        }
        else {
            if (this.modalImages instanceof Observable$1) {
                this.subscription = ((this.modalImages)).subscribe((val) => {
                    this.images = val;
                    this.completeInitialization(emitHasDataEvent);
                });
            }
        }
    }
    /**
     * Private method ´completeInitialization´ to emit ImageModalEvent to say that images are loaded. If you are
     * using imagePointer feature, it will also call showModalGallery with imagePointer as parameter.
     * @param {?} emitHasDataEvent boolean to emit `hasData` event while initializing `angular-modal-gallery`.
     *  Use this parameter to prevent multiple `hasData` events.
     * @return {?}
     */
    completeInitialization(emitHasDataEvent) {
        if (emitHasDataEvent) {
            // this will prevent multiple emissions if called from both ngOnInit and ngOnChanges
            this.hasData.emit(new ImageModalEvent(Action.LOAD, true));
        }
        this.loading = true;
        if (this.imagePointer >= 0) {
            this.showGallery = false;
            this.showModalGallery(this.imagePointer);
        }
        else {
            this.showGallery = true;
        }
    }
    /**
     * Private method `emitBoundaryEvent` to emit events when either the last or the first image are visible.
     * @param {?} action Enum of type Action that represents the source of the event that changed the
     *  current image to the first one or the last one.
     * @param {?} indexToCheck Number of type Action that represents the source of the event that changed the
     *  current image to either the first or the last one.
     * @return {?}
     */
    emitBoundaryEvent(action, indexToCheck) {
        // to emit first/last event
        switch (indexToCheck) {
            case 0:
                this.firstImage.emit(new ImageModalEvent(action, true));
                break;
            case this.images.length - 1:
                this.lastImage.emit(new ImageModalEvent(action, true));
                break;
        }
    }
    /**
     * Method `getFileName` to get the filename from an input path.
     * This is used to get the image's name from its path.
     * @param {?} path String that represents the path of the image.
     * @return {?}
     */
    getFileName(path) {
        return path.replace(/^.*[\\\/]/, '');
    }
    /**
     * Method `manageSlideConfig` to manage boundary arrows and sliding.
     * This is based on \@Input() slideConfig to enable/disable 'infinite sliding'.
     * @param {?} index
     * @return {?}
     */
    manageSlideConfig(index) {
        if (!this.slideConfig || this.slideConfig.infinite !== false) {
            this.isFirstImage = false;
            this.isLastImage = false;
        }
        else {
            this.isFirstImage = index === 0;
            this.isLastImage = index === this.images.length - 1;
        }
    }
    /**
     * Method `isPreventSliding` to check if next/prev actions should be blocked.
     * It checks if slideConfig.infinite === false and if the image index is equals to the input parameter.
     * If yes, it returns true to say that sliding should be blocked, otherwise not.
     *  of images (this.images.length - 1).
     *  either the first or the last one.
     * @param {?} boundaryIndex
     * @return {?}
     */
    isPreventSliding(boundaryIndex) {
        return !!this.slideConfig && this.slideConfig.infinite === false &&
            this.currentImageIndex === boundaryIndex;
    }
}
AngularModalGalleryComponent.decorators = [
    { type: Component, args: [{
                selector: 'modal-gallery',
                exportAs: 'modalGallery',
                styles: [`
    /*
     The MIT License (MIT)

     Copyright (c) 2017 Stefano Cappa (Ks89)
     Copyright (c) 2016 vimalavinisha

     Permission is hereby granted, free of charge, to any person obtaining a copy
     of this software and associated documentation files (the "Software"), to deal
     in the Software without restriction, including without limitation the rights
     to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     copies of the Software, and to permit persons to whom the Software is
     furnished to do so, subject to the following conditions:

     The above copyright notice and this permission notice shall be included in all
     copies or substantial portions of the Software.

     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
     AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
     SOFTWARE.
     */
    .ng-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      /*opacity: 0.85;*/
      z-index: 9999;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      -webkit-user-drag: none; }

    .ng-gallery-content {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10000;
      text-align: center; }
      .ng-gallery-content > a.nav-left, .ng-gallery-content > a.nav-right {
        color: #fff !important;
        text-decoration: none;
        font-size: 60px;
        cursor: pointer;
        outline: none; }
      .ng-gallery-content > a.nav-left {
        position: fixed;
        left: 15px;
        top: 50%;
        -webkit-transform: translateY(-50%);
                transform: translateY(-50%); }
      .ng-gallery-content > a.nav-right {
        position: fixed;
        right: 15px;
        top: 50%;
        -webkit-transform: translateY(-50%);
                transform: translateY(-50%); }
      .ng-gallery-content > img {
        height: auto;
        max-height: calc(100% - 150px);
        max-width: calc(100% - 100px);
        position: relative;
        display: block;
        margin: 0 auto 0 auto;
        top: 50%;
        transform: translateY(-50%);
        -webkit-transform: translateY(-50%);
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-user-drag: none; }
      .ng-gallery-content.effect {
        -webkit-animation: fadeIn 0.5s;
                animation: fadeIn 0.5s; }
      .ng-gallery-content > span.info-text {
        color: #fff;
        display: inline-block;
        width: 100%;
        height: 20px;
        font-weight: bold;
        text-align: center;
        position: fixed;
        left: 0;
        right: 0; }
      @media (max-width: 676px) {
        .ng-gallery-content > span.info-text {
          bottom: 100px; } }
      @media (min-width: 676px) and (max-width: 752px) {
        .ng-gallery-content > span.info-text {
          padding-top: 52px; } }
      @media (min-width: 752px) and (max-width: 804px) {
        .ng-gallery-content > span.info-text {
          padding-top: 43px; } }
      @media (min-width: 804px) {
        .ng-gallery-content > span.info-text {
          bottom: 100px; } }
      .ng-gallery-content > .ng-thumbnails-wrapper {
        width: 400px;
        height: 70px;
        text-align: center;
        position: fixed;
        bottom: 20px;
        left: 0;
        right: 0;
        margin-left: auto;
        margin-right: auto;
        overflow-x: hidden; }
        .ng-gallery-content > .ng-thumbnails-wrapper > .ng-thumbnails {
          width: 4000px;
          height: 70px; }
          .ng-gallery-content > .ng-thumbnails-wrapper > .ng-thumbnails > div > img {
            width: auto;
            height: 70px;
            float: left;
            margin-right: 10px;
            cursor: pointer;
            opacity: 0.6; }
            .ng-gallery-content > .ng-thumbnails-wrapper > .ng-thumbnails > div > img:hover, .ng-gallery-content > .ng-thumbnails-wrapper > .ng-thumbnails > div > img.active {
              -webkit-transition: opacity 0.25s ease;
              transition: opacity 0.25s ease;
              opacity: 1; }

    @-webkit-keyframes fadeIn {
      from {
        opacity: 0.3; }
      to {
        opacity: 1; } }

    @keyframes fadeIn {
      from {
        opacity: 0.3; }
      to {
        opacity: 1; } }

    /* Loading - from http://loading.io */
    uiload {
      display: inline-block;
      position: relative; }
      uiload > div {
        position: relative; }

    @-webkit-keyframes uil-ring-anim {
      0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg); }
      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg); } }

    @keyframes uil-ring-anim {
      0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg); }
      100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg); } }

    .uil-ring-css {
      background: none;
      position: relative;
      top: 0;
      margin: 180px auto 0 auto;
      width: 100px;
      height: 100px; }
      .uil-ring-css > div {
        position: absolute;
        display: block;
        width: 80px;
        height: 80px;
        top: 20px;
        left: 20px;
        border-radius: 40px;
        -webkit-box-shadow: 0 6px 0 0 #fff;
                box-shadow: 0 6px 0 0 #fff;
        -webkit-animation: uil-ring-anim 1s linear infinite;
        animation: uil-ring-anim 1s linear infinite; }
  `],
                template: `
    <gallery [images]="images" [showGallery]="showGallery" (show)="onShowModalGallery($event)"></gallery>

    <div class="ng-overlay" *ngIf="opened">

      <div id="ng-gallery-content" class="ng-gallery-content"
           click-outside [clickOutsideEnable]="enableCloseOutside"
           (clickOutside)="onClickOutside($event)">

          <div class="uil-ring-css" *ngIf="loading">
            <div></div>
          </div>

          <upperButtons [image]="currentImage" [configButtons]="configButtons"
                        (close)="closeGallery()" (download)="downloadImage()"></upperButtons>

          <a class="nav-left" *ngIf="images?.length > 1"
             [hidden]="isFirstImage"
             (click)="prevImage()"><i class="fa fa-angle-left"></i>
          </a>
          <img *ngIf="!loading" class="effect" src="{{ currentImage.img }}"
               alt="{{getAltDescriptionByImage(currentImage)}}"
               (click)="nextImage(clickAction)"
               (swipeleft)="swipe(currentImageIndex, $event.type)"
               (swiperight)="swipe(currentImageIndex, $event.type)"/>
          <a class="nav-right" *ngIf="images?.length > 1"
             [hidden]="isLastImage"
             (click)="nextImage()"><i class="fa fa-angle-right"></i>
          </a>
          <span class="info-text">{{getDescriptionToDisplay()}}</span>
      </div>
    </div>
  `
            },] },
];
/**
 * @nocollapse
 */
AngularModalGalleryComponent.ctorParameters = () => [
    { type: KeyboardService, },
];
AngularModalGalleryComponent.propDecorators = {
    'modalImages': [{ type: Input },],
    'imagePointer': [{ type: Input },],
    'downloadable': [{ type: Input },],
    'description': [{ type: Input },],
    'buttonsConfig': [{ type: Input },],
    'keyboardConfig': [{ type: Input },],
    'enableCloseOutside': [{ type: Input },],
    'slideConfig': [{ type: Input },],
    'showDownloadButton': [{ type: Input },],
    'showExtUrlButton': [{ type: Input },],
    'close': [{ type: Output },],
    'show': [{ type: Output },],
    'firstImage': [{ type: Output },],
    'lastImage': [{ type: Output },],
    'hasData': [{ type: Output },],
    'onKeyDown': [{ type: HostListener, args: ['window:keydown', ['$event'],] },],
};

/*
 The MIT License (MIT)

 Copyright (c) 2017 Stefano Cappa (Ks89)

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */
/**
 * Directive to display the external url button.
 * To show this button, you must provide a ButtonsConfig object with 'extUrl: true' as property.
 * All other configurations will hide this button.
 * Pay attention, because this directive is quite smart to choose button's order using the
 * correct right margin in pixels. To do that, it uses also imgExtUrl and configButtons.
 */
class ExternalUrlButtonDirective {
    /**
     * @param {?} renderer
     * @param {?} el
     */
    constructor(renderer, el) {
        this.renderer = renderer;
        this.el = el;
        this.RIGHT = 63;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.applyStyle();
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        this.applyStyle();
    }
    /**
     * @return {?}
     */
    applyStyle() {
        let /** @type {?} */ right = 0;
        if (this.configButtons && this.configButtons.extUrl && this.imgExtUrl) {
            right = this.getNumOfPrecedingButtons() * this.RIGHT;
        }
        else {
            right = 0;
        }
        // apply [style.right]="" to external url <a></a>
        this.renderer.setElementStyle(this.el.nativeElement, 'right', `${right}px`);
        // hide externalUrlButton based on this condition
        // configButtons && !configButtons.extUrl OR imgExtUrl is not valid (for instance is null)
        this.renderer.setElementProperty(this.el.nativeElement, 'hidden', !this.configButtons || (this.configButtons && !this.configButtons.extUrl) || !this.imgExtUrl);
    }
    /**
     * @return {?}
     */
    getNumOfPrecedingButtons() {
        let /** @type {?} */ num = 0;
        if (!this.configButtons) {
            return num;
        }
        if (this.configButtons.close === undefined || this.configButtons.close === true) {
            num++;
        }
        return num;
    }
}
ExternalUrlButtonDirective.decorators = [
    { type: Directive, args: [{
                selector: '[exturl-button]'
            },] },
];
/**
 * @nocollapse
 */
ExternalUrlButtonDirective.ctorParameters = () => [
    { type: Renderer, },
    { type: ElementRef, },
];
ExternalUrlButtonDirective.propDecorators = {
    'configButtons': [{ type: Input },],
    'imgExtUrl': [{ type: Input },],
};

/**
 * Directive to display the download button.
 * To show this button, you must provide a ButtonsConfig object with 'download: true' as property.
 * All other configurations will hide this button.
 * Pay attention, because this directive is quite smart to choose button's order using the
 * correct right margin in pixels. To do that, it uses also imgExtUrl and configButtons.
 */
class DownloadButtonDirective {
    /**
     * @param {?} renderer
     * @param {?} el
     */
    constructor(renderer, el) {
        this.renderer = renderer;
        this.el = el;
        this.RIGHT = 63;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.applyStyle();
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        this.applyStyle();
    }
    /**
     * @return {?}
     */
    applyStyle() {
        let /** @type {?} */ right = 0;
        if (this.configButtons && this.configButtons.download) {
            right = this.getNumOfPrecedingButtons() * this.RIGHT;
        }
        else {
            right = 0;
        }
        // apply [style.right]="" to download url <a></a>
        this.renderer.setElementStyle(this.el.nativeElement, 'right', `${right}px`);
        // hide downloadButton if configButtons.download is false
        this.renderer.setElementProperty(this.el.nativeElement, 'hidden', !this.configButtons || (this.configButtons && !this.configButtons.download));
    }
    /**
     * @return {?}
     */
    getNumOfPrecedingButtons() {
        let /** @type {?} */ num = 0;
        if (!this.configButtons) {
            return num;
        }
        if (this.configButtons.extUrl && this.imgExtUrl) {
            num++;
        }
        if (this.configButtons.close === undefined || this.configButtons.close === true) {
            num++;
        }
        return num;
    }
}
DownloadButtonDirective.decorators = [
    { type: Directive, args: [{
                selector: '[download-button]'
            },] },
];
/**
 * @nocollapse
 */
DownloadButtonDirective.ctorParameters = () => [
    { type: Renderer, },
    { type: ElementRef, },
];
DownloadButtonDirective.propDecorators = {
    'configButtons': [{ type: Input },],
    'imgExtUrl': [{ type: Input },],
};

/*
 The MIT License (MIT)

 Copyright (c) 2017 Stefano Cappa (Ks89)

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */
/**
 * Directive to display the close button.
 * To hide this button, you must provide a ButtonsConfig object with 'close: false' as property.
 * All other configurations won't hide this button.
 */
class CloseButtonDirective {
    /**
     * @param {?} renderer
     * @param {?} el
     */
    constructor(renderer, el) {
        this.renderer = renderer;
        this.el = el;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.applyStyle();
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        this.applyStyle();
    }
    /**
     * @return {?}
     */
    applyStyle() {
        // apply [style.right]="" to close url <a></a>
        this.renderer.setElementStyle(this.el.nativeElement, 'right', '0px');
        const /** @type {?} */ condition = this.configButtons === null || (this.configButtons && this.configButtons.close === false);
        // hide closeButton if configButtons.close is false
        this.renderer.setElementProperty(this.el.nativeElement, 'hidden', condition);
    }
}
CloseButtonDirective.decorators = [
    { type: Directive, args: [{
                selector: '[close-button]'
            },] },
];
/**
 * @nocollapse
 */
CloseButtonDirective.ctorParameters = () => [
    { type: Renderer, },
    { type: ElementRef, },
];
CloseButtonDirective.propDecorators = {
    'configButtons': [{ type: Input },],
};

/*
 The MIT License (MIT)

 Copyright (c) 2017 Stefano Cappa (Ks89)

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */
/**
 * Directive to close the modal gallery clicking on the semi-transparent background.
 * In fact, it listens for a click on the element with id="ng-gallery-content" and it emits
 * an event using `\@Output clickOutside`.
 */
class ClickOutsideDirective {
    constructor() {
        this.clickOutside = new EventEmitter();
    }
    /**
     * @param {?} targetElement
     * @return {?}
     */
    onClick(targetElement) {
        let /** @type {?} */ elementId = targetElement.id;
        if (elementId === 'ng-gallery-content' && this.clickOutsideEnable) {
            this.clickOutside.emit(true);
        }
    }
}
ClickOutsideDirective.decorators = [
    { type: Directive, args: [{
                selector: '[click-outside]'
            },] },
];
/**
 * @nocollapse
 */
ClickOutsideDirective.ctorParameters = () => [];
ClickOutsideDirective.propDecorators = {
    'clickOutsideEnable': [{ type: Input },],
    'clickOutside': [{ type: Output },],
    'onClick': [{ type: HostListener, args: ['document:click', ['$event.target'],] },],
};

/*
 The MIT License (MIT)

 Copyright (c) 2017 Stefano Cappa (Ks89)

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */
/**
 * Array of all directives.
 */
const DIRECTIVES = [
    ExternalUrlButtonDirective, DownloadButtonDirective, CloseButtonDirective, ClickOutsideDirective
];

/*
 The MIT License (MIT)

 Copyright (c) 2017 Stefano Cappa (Ks89)

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */
/**
 * Component with all upper right buttons.
 * In fact, it uses a template with extUrl, download and close buttons with the right directive.
 * Also it emits click events as outputs.
 */
class UpperButtonsComponent {
    constructor() {
        this.close = new EventEmitter();
        this.download = new EventEmitter();
    }
    /**
     * @return {?}
     */
    downloadImage() {
        this.download.emit(true);
    }
    /**
     * @return {?}
     */
    closeGallery() {
        this.close.emit(true);
    }
}
UpperButtonsComponent.decorators = [
    { type: Component, args: [{
                selector: 'upperButtons',
                styles: [`
    a.close-popup {
      font-size: 42px;
      float: right;
      color: #fff !important;
      text-decoration: none;
      margin: 0 30px 0 0;
      cursor: pointer;
      position: absolute;
      top: 20px;
      right: 0; }

    a.external-url-image {
      font-size: 33px;
      float: right;
      color: #fff !important;
      text-decoration: none;
      margin: 0 30px 0 0;
      cursor: pointer;
      position: absolute;
      top: 28px;
      right: 0px; }

    a.download-image {
      font-size: 33px;
      float: right;
      color: #fff !important;
      text-decoration: none;
      margin: 0 30px 0 0;
      cursor: pointer;
      position: absolute;
      top: 28px;
      right: 0px; }
  `],
                template: `
    <a class="external-url-image" href="{{image?.extUrl}}"
       exturl-button [configButtons]="configButtons" [imgExtUrl]="image?.extUrl"><i class="fa fa-external-link"></i></a>
    <a class="download-image"
       download-button [configButtons]="configButtons" [imgExtUrl]="image?.extUrl"
       (click)="downloadImage()"><i class="fa fa-download"></i></a>
    <a class="close-popup"
       close-button [configButtons]="configButtons"
       (click)="closeGallery()"><i class="fa fa-close"></i></a>
  `
            },] },
];
/**
 * @nocollapse
 */
UpperButtonsComponent.ctorParameters = () => [];
UpperButtonsComponent.propDecorators = {
    'image': [{ type: Input },],
    'configButtons': [{ type: Input },],
    'close': [{ type: Output },],
    'download': [{ type: Output },],
};

/*
 The MIT License (MIT)

 Copyright (c) 2017 Stefano Cappa (Ks89)

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */
/**
 * Component with the gallery of thumbs.
 * In receives an array of Images and a boolean to show/hide
 * the gallery (feature used by imagePointer).
 * Also it emits click events as outputs.
 */
class GalleryComponent {
    constructor() {
        this.show = new EventEmitter();
    }
    /**
     * @param {?} index
     * @return {?}
     */
    showModalGallery(index) {
        this.show.emit(index);
    }
    /**
     * Method to get `alt attribute`.
     * `alt` specifies an alternate text for an image, if the image cannot be displayed.
     * There is a similar version of this method into `modal-gallery.component.ts` that
     * receives an Image as input.
     * @param {?} index Number that represents the image index.
     * @return {?}
     */
    getAltDescriptionByIndex(index) {
        if (!this.images) {
            return '';
        }
        if (!this.images[index] || !this.images[index].description) {
            return `Image ${index}`;
        }
        return this.images[index].description;
    }
}
GalleryComponent.decorators = [
    { type: Component, args: [{
                selector: 'gallery',
                styles: [`
    /*
     The MIT License (MIT)

     Copyright (c) 2017 Stefano Cappa (Ks89)
     Copyright (c) 2016 vimalavinisha

     Permission is hereby granted, free of charge, to any person obtaining a copy
     of this software and associated documentation files (the "Software"), to deal
     in the Software without restriction, including without limitation the rights
     to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
     copies of the Software, and to permit persons to whom the Software is
     furnished to do so, subject to the following conditions:

     The above copyright notice and this permission notice shall be included in all
     copies or substantial portions of the Software.

     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
     IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
     FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
     AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
     LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
     OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
     SOFTWARE.
     */
    .ng-gallery {
      width: 100%;
      display: inline-block; }

    img.ng-thumb {
      height: 50px;
      float: left;
      display: block;
      cursor: pointer;
      margin: 2px 2px 0 0; }
  `],
                template: `
    <div class="ng-gallery" *ngIf="showGallery">
      <div *ngFor="let i of images; let index = index">
        <ng-container *ngIf="i && i.img">
          <img *ngIf="i.thumb" src="{{ i.thumb }}" class="ng-thumb" (click)="showModalGallery(index)"
               alt="{{getAltDescriptionByIndex(index)}}"/>
          <img *ngIf="!i.thumb" src="{{ i.img }}" class="ng-thumb" (click)="showModalGallery(index)"
               alt="{{getAltDescriptionByIndex(index)}}"/>
        </ng-container>
      </div>
    </div>
  `
            },] },
];
/**
 * @nocollapse
 */
GalleryComponent.ctorParameters = () => [];
GalleryComponent.propDecorators = {
    'images': [{ type: Input },],
    'showGallery': [{ type: Input },],
    'show': [{ type: Output },],
};

/*
 The MIT License (MIT)

 Copyright (c) 2017 Stefano Cappa (Ks89)

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */
const KEYBOARD_CONFIGURATION = new InjectionToken('KEYBOARD_CONFIGURATION');
/**
 * Module with `forRoot` method to import it in the root module of your application.
 */
class ModalGalleryModule {
    /**
     * @param {?=} config
     * @return {?}
     */
    static forRoot(config) {
        return {
            ngModule: ModalGalleryModule,
            providers: [
                {
                    provide: KEYBOARD_CONFIGURATION,
                    useValue: config ? config : {}
                },
                {
                    provide: KeyboardService,
                    useFactory: setupRouter,
                    deps: [KEYBOARD_CONFIGURATION]
                }
            ]
        };
    }
}
ModalGalleryModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
                declarations: [AngularModalGalleryComponent, UpperButtonsComponent, GalleryComponent, DIRECTIVES],
                exports: [AngularModalGalleryComponent]
            },] },
];
/**
 * @nocollapse
 */
ModalGalleryModule.ctorParameters = () => [];
/**
 * @param {?} injector
 * @return {?}
 */
function setupRouter(injector) {
    return new KeyboardService(injector);
}

/*
 * MIT License
 *
 * Copyright (c) 2017 Stefano Cappa
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { ModalGalleryModule, Action, Image, ImageModalEvent, GalleryComponent as ɵg, AngularModalGalleryComponent as ɵc, UpperButtonsComponent as ɵf, ClickOutsideDirective as ɵl, CloseButtonDirective as ɵk, DIRECTIVES as ɵh, DownloadButtonDirective as ɵj, ExternalUrlButtonDirective as ɵi, KEYBOARD_CONFIGURATION as ɵa, setupRouter as ɵb, KeyboardService as ɵd };
//# sourceMappingURL=angular-modal-gallery.js.map
