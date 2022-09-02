import {FilterFormat} from "~/utils/filters/index";
import {Necklaces}    from "~/components/icons/accessories/Necklaces";
import {Earrings}     from "~/components/icons/accessories/Earrings";
import {Bracelets}    from "~/components/icons/accessories/Bracelets";
import {Rings}        from "~/components/icons/accessories/Ring";

export const accessories: FilterFormat[] = [
    {
        name: `Necklaces`,
        icon: Necklaces,
    },
    {
        name: `Earrings`,
        icon: Earrings,
    },
    {
        name: `Bracelets`,
        icon: Bracelets,
    },
    {
        name: `Rings`,
        icon: Rings,
    },
];
