import type Player from '../Player';
import { InPlayCard } from './baseClasses/InPlayCard';
import * as Contract from '../utils/Contract';
import type { ZoneName } from '../Constants';
import { CardType } from '../Constants';

export class LeaderCard extends InPlayCard {
    protected _deployed = false;

    protected setupLeaderUnitSide;

    public get deployed() {
        return this._deployed;
    }

    public constructor(owner: Player, cardData: any) {
        super(owner, cardData);
        Contract.assertEqual(this.printedType, CardType.Leader);

        this.setupLeaderUnitSide = false;
        this.setupLeaderSideAbilities(this);
    }

    public override isLeader(): this is LeaderCard {
        return true;
    }

    // this is overriden in the LeaderUnit derived class
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public deploy() {}

    /**
     * Create card abilities for the leader (non-unit) side by calling subsequent methods with appropriate properties
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected setupLeaderSideAbilities(sourceCard: this) { }

    // TODO TYPE REFACTOR: separate out the Leader types from the playable types
    public override getPlayCardActions() {
        return [];
    }

    // TODO TYPE REFACTOR: leaders shouldn't have the takeControl method
    public override takeControl(newController: Player, _moveTo?: ZoneName.SpaceArena | ZoneName.GroundArena | ZoneName.Resource) {
        Contract.fail(`Attempting to take control of leader ${this.internalName} for player ${newController.name}, which is illegal`);
    }
}
