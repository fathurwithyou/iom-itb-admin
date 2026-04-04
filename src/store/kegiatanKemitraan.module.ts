import ApiService from "./api.service";
import { ActionContext } from "vuex";

export const GET_KEGIATAN_KEMITRAANS = "getKegiatanKemitraans";
export const SET_KEGIATAN_KEMITRAANS = "setKegiatanKemitraans";
export const POST_KEGIATAN_KEMITRAAN = "postKegiatanKemitraan";
export const PUT_KEGIATAN_KEMITRAAN = "putKegiatanKemitraan";
export const DELETE_KEGIATAN_KEMITRAAN = "deleteKegiatanKemitraan";

interface KegiatanKemitraan {
    id: number;
    kemitraanId: number;
    title: string;
    subtitle: string;
    date: string;
    description: string;
    image: string;
}

interface Pagination {
    start: number;
    end: number;
    totalEntries: number;
    currentPage: number;
    totalPages: number;
}

interface PaginatedKegiatanKemitraan {
    data: KegiatanKemitraan[];
    pagination: Pagination;
}

interface State {
    kegiatanKemitraans: PaginatedKegiatanKemitraan | null;
}

const state: State = {
    kegiatanKemitraans: null,
};

const getters = {
    kegiatanKemitraans(state: State): PaginatedKegiatanKemitraan | null {
        return state.kegiatanKemitraans;
    },
};

type VuexContext = ActionContext<State, any>;

const actions = {
    [GET_KEGIATAN_KEMITRAANS](context: VuexContext, params: Record<string, any>): Promise<any> {
        return new Promise((resolve, reject) => {
            ApiService.get<{ data: any }>("/kegiatan-kemitraan", params)
                .then(response => {
                    context.commit(SET_KEGIATAN_KEMITRAANS, response);
                    resolve(response);
                })
                .catch(err => {
                    console.error("Error fetching kegiatan kemitraan:", err);
                    reject(err);
                });
        });
    },
    [POST_KEGIATAN_KEMITRAAN](context: VuexContext, params: Record<string, any>): Promise<KegiatanKemitraan[]> {
        return new Promise((resolve, reject) => {
            ApiService.post<{ data: KegiatanKemitraan[] }>("/kegiatan-kemitraan", params.data)
                .then(({ data }) => { resolve(data); })
                .catch((err) => { reject(err); });
        });
    },
    [PUT_KEGIATAN_KEMITRAAN](context: VuexContext, params: Record<string, any>): Promise<KegiatanKemitraan[]> {
        return new Promise((resolve, reject) => {
            ApiService.put<{ data: KegiatanKemitraan[] }>(`/kegiatan-kemitraan/${params.id}`, params.data)
                .then(({ data }) => { resolve(data); })
                .catch((err) => { reject(err); });
        });
    },
    [DELETE_KEGIATAN_KEMITRAAN](context: VuexContext, params: Record<string, any>): Promise<void> {
        return new Promise((resolve, reject) => {
            ApiService.delete(`/kegiatan-kemitraan/${params.id}`)
                .then(() => { resolve(); })
                .catch((err) => { reject(err); });
        });
    },
};

const mutations = {
    [SET_KEGIATAN_KEMITRAANS](state: State, data: PaginatedKegiatanKemitraan): void {
        state.kegiatanKemitraans = data;
    },
};

export default { state, getters, actions, mutations };
