import { AdvancedSearchFilters } from "@/interfaces/Interfaces";

export const initialState: AdvancedSearchFilters = {
    nameFilter: "",
    textFilter: "",
    typesFilter: [],
    colorsFilter: {
        colors: [],
        option: "Exactly these colors"
    },
    CMCsFilter: "",
    statsFilter: [],
    gameModesFilter: [],
    formatsFilter: [],
    blocksFilter: {
        sets: [],
        blocks: []
    },
    raritiesFilter: [],
    flavorTextFilter: ""
};


export type Action =
    {
        type: "SET_FILTER";
        field: keyof AdvancedSearchFilters;
        payload: AdvancedSearchFilters[keyof AdvancedSearchFilters];
    };


export const advancedSearchReducer = (
    state: AdvancedSearchFilters,
    action: Action
): AdvancedSearchFilters => {
    switch (action.type) {
        case "SET_FILTER":
            return {
                ...state,
                [action.field]: action.payload,
            };

        default:
            return state;
    }
};