import Job from "~/components/icons/jobs";
import {ReactNode} from "react";

type FilterFormat = {
    name: string, abbreviation: string, icon: ReactNode,
}

const arms: FilterFormat[] = [{name: `Archanist's Arms`, abbreviation: `ACN`, icon: Job.ACN}, {
    name: `Archer's Arms`, abbreviation: `ARC`, icon: Job.ARC
}, {
    name: `Astrologian's Arms`, abbreviation: `AST`, icon: Job.AST
}, {
    name: `Blue Mage's Arms`, abbreviation: `BLU`, icon: Job.BLU
}, {
    name: `Conjurer's Arms`, abbreviation: `CNJ`, icon: Job.CNJ
}, {
    name: `Dark Knight's Arms`, abbreviation: `DRK`, icon: Job.DRK
}, {name: `Gladiator's Arms`, abbreviation: 'GLA', icon: Job.GLA,}, {
    name: `Lancer's Arms`, abbreviation: `LNC`, icon: Job.LNC
}, {
    name: `Machinist's Arms`, abbreviation: `MCH`, icon: Job.MCH
}, {name: `Marauder's Arms`, abbreviation: 'MRD', icon: Job.MRD,}, {
    name: `Pugilist's Arms`, abbreviation: 'PGL', icon: Job.PGL,
}, {
    name: `Red Mage's Arms`, abbreviation: `RDM`, icon: Job.RDM
}, {name: `Rogue's Arms`, abbreviation: `ROG`, icon: Job.ROG}, {
    name: `Samurai's Arms`, abbreviation: `SAM`, icon: Job.SAM
}, {
    name: `Scholar's Arms`, abbreviation: `SCH`, icon: Job.SCH
}, {
    name: `Thaumaturge's Arms`, abbreviation: `THM`, icon: Job.THM
},]

export default arms;


/**
 *                         <option value="9">Pugilist's Arms</option>
 *                         <option value="10">Gladiator's Arms</option>
 *                         <option value="11">Marauder's Arms</option>
 *                         <option value="12">Archer's Arms</option>
 *                         <option value="13">Lancer's Arms</option>
 *                         <option value="14">Thaumaturge's Arms</option>
 *                         <option value="15">Conjurer's Arms</option>
 *                         <option value="16">Arcanist's Arms</option>
 *                         <option value="73">Rogue's Arms</option>
 *                         <option value="76">Dark Knight's Arms</option>
 *                         <option value="77">Machinist's Arms</option>
 *                         <option value="78">Astrologian's Arms</option>
 *                         <option value="83">Samurai's Arms</option>
 *                         <option value="84">Red Mage's Arms</option>
 *                         <option value="85">Scholar's Arms</option>
 *                         <option value="86">Gunbreaker's Arms</option>
 *                         <option value="87">Dancer's Arms</option>
 *                         <option value="88">Reaper's Arms</option>
 *                         <option value="89">Sage's Arms</option>
 *                     </select>
 */
