const AbilityHelper = require('../../AbilityHelper');
const { GameObject } = require('../GameObject.js');

const { Duration, WildcardLocation } = require('../Constants.js');
const OngoingEffect = require('./OngoingEffect.js');
const { default: Contract } = require('../utils/Contract.js');

// This class is inherited by Card and also represents Framework effects

class OngoingEffectSource extends GameObject {
    constructor(game, name = 'Framework effect') {
        super(game, name);
    }

    /**
     * Applies an effect which lasts until the end of the phase.
     */
    untilEndOfPhase(propertyFactory) {
        var properties = propertyFactory(AbilityHelper);
        this.addEffectToEngine(Object.assign({ duration: Duration.UntilEndOfPhase, locationFilter: WildcardLocation.Any }, properties));
    }

    /**
     * Applies an effect which lasts until the end of the round.
     */
    untilEndOfRound(propertyFactory) {
        var properties = propertyFactory(AbilityHelper);
        this.addEffectToEngine(Object.assign({ duration: Duration.UntilEndOfRound, locationFilter: WildcardLocation.Any }, properties));
    }

    /**
     * Applies a 'lasting effect' (SWU 7.3) which lasts until an event contained in the `until` property for the effect has occurred.
     */
    lastingEffect(propertyFactory) {
        let properties = propertyFactory(AbilityHelper);
        this.addEffectToEngine(Object.assign({ duration: Duration.Custom, locationFilter: WildcardLocation.Any }, properties));
    }

    /**
     * Adds persistent/lasting/delayed effect(s) to the effect engine
     * @param {Object} properties properties for the effect(s), see {@link OngoingEffect}
     * @returns {OngoingEffect[]} the effect(s) that were added to the engine
     */
    addEffectToEngine(properties) {
        if (!Contract.assertFalse('location' in properties, 'Attempting to create an effect with the \'location\' property, instead should be using the \'locationFilter\' property.')) {
            // just to catch any accidental use of the 'location' property we missed when doing the refactor to naming 'locationFilter'
            throw Error('Attempting to create an effect with the \'location\' property, instead should be using the \'locationFilter\' property');
        }

        let ongoingEffect = properties.ongoingEffect;

        let propertiesWithoutEffect;
        {
            let { ongoingEffect, ...remainingProperties } = properties;
            propertiesWithoutEffect = remainingProperties;
        }

        if (Array.isArray(ongoingEffect)) {
            return ongoingEffect.map((factory) => this.game.ongoingEffectEnginer.add(factory(this.game, this, propertiesWithoutEffect)));
        }
        return [this.game.ongoingEffectEnginer.add(ongoingEffect(this.game, this, propertiesWithoutEffect))];
    }

    removeEffectFromEngine(effectArray) {
        this.game.ongoingEffectEnginer.unapplyAndRemove((effect) => effectArray.includes(effect));
    }

    removeLastingEffects() {
        this.game.ongoingEffectEnginer.removeLastingEffects(this);
    }
}

module.exports = OngoingEffectSource;