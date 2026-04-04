import ApiService from "./api.service";
import { ActionContext } from "vuex";

export const GET_KEMITRAANS = "getKemitraans";
export const SET_KEMITRAANS = "setKemitraans";
export const POST_KEMITRAAN = "postKemitraan";
export const PUT_KEMITRAAN = "putKemitraan";
export const DELETE_KEMITRAAN = "deleteKemitraan";

interface Kemitraan {
    id: number;
    title: string;
    description: string;
    image: string;
    mou: string;
}

interface Pagination {
    start: number;
    end: number;
    totalEntries: number;
    currentPage: number;
    totalPages: number;
}

interface PaginatedKemitraan {
    data: Kemitraan[];
    pagination: Pagination;
}

interface State {
    kemitraans: PaginatedKemitraan | null;
}

const state: State = {
    kemitraans: null,
};

const getters = {
    kemitraans(state: State): PaginatedKemitraan | null {
        return state.kemitraans;
    },
};

type VuexContext = ActionContext<State, any>;

const actions = {
    [GET_KEMITRAANS](context: VuexContext, params: Record<string, any>): Promise<any> {
        return new Promise((resolve, reject) => {
            ApiService.get<{ data: any }>("/kemitraan", params)
                .then(response => {
                    context.commit(SET_KEMITRAANS, response);
                    resolve(response);
                })
                .catch(err => {
                    console.error("Error fetching kemitraans:", err);
                    reject(err);
                });
        });
    },
    [POST_KEMITRAAN](context: VuexContext, params: Record<string, any>): Promise<Kemitraan[]> {
        return new Promise((resolve, reject) => {
            ApiService.post<{ data: Kemitraan[] }>("/kemitraan", params.data)
                .then(({ data }) => { resolve(data); })
                .catch((err) => { reject(err); });
        });
    },
    [PUT_KEMITRAAN](context: VuexContext, params: Record<string, any>): Promise<Kemitraan[]> {
        return new Promise((resolve, reject) => {
            ApiService.put<{ data: Kemitraan[] }>(`/kemitraan/${params.id}`, params.data)
                .then(({ data }) => { resolve(data); })
                .catch((err) => { reject(err); });
        });
    },
    [DELETE_KEMITRAAN](context: VuexContext, params: Record<string, any>): Promise<void> {
        return new Promise((resolve, reject) => {
            ApiService.delete(`/kemitraan/${params.id}`)
                .then(() => { resolve(); })
                .catch((err) => { reject(err); });
        });
    },
};

const mutations = {
    [SET_KEMITRAANS](state: State, data: PaginatedKemitraan): void {
        state.kemitraans = data;
    },
};

export default { state, getters, actions, mutations };
