import {FilterFormat} from "~/utils/filters/index";
import {Necklaces}    from "~/components/icons/accessories/Necklaces";
import {Earrings}     from "~/components/icons/accessories/Earrings";
import {Bracelets}    from "~/components/icons/accessories/Bracelets";
import {Rings}        from "~/components/icons/accessories/Ring";

export const accessories: FilterFormat[] = [
    {
        name: `Necklaces`,
        icon: Necklaces,
        id:   39,
    },
    {
        name: `Earrings`,
        icon: Earrings,
        id:   40,
    },
    {
        name: `Bracelets`,
        icon: Bracelets,
        id:   41,
    },
    {
        name: `Rings`,
        icon: Rings,
        id:   42,
    },
];
