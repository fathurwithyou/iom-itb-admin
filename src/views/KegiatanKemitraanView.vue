<template>
  <div>
    <Breadcrumb :breadcrumb="title" />

    <ModalForm
      v-if="isOpened"
      :id="currentId"
      :title="`${currentId ? 'Edit' : 'Add'} Kegiatan`"
      :data="dataUpdate"
      @close="handleModalClose"
    />

    <div class="mt-8">
      <div class="mt-6">
        <h2 class="text-xl font-semibold leading-tight text-gray-700">{{ title }}</h2>

        <div class="flex flex-col mt-3 sm:flex-row justify-between">
          <div class="flex items-center">
            <div class="flex">
              <div class="relative">
                <select
                  class="block w-full h-full px-4 py-2 pr-8 leading-tight text-gray-700 bg-white border border-gray-400 rounded-l appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
                  v-model="limit"
                  @change="getData"
                >
                  <option :value="5">5</option>
                  <option :value="10">10</option>
                  <option :value="20">20</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                  <svg class="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>

              <div class="relative block mt-2 sm:mt-0">
                <span class="absolute inset-y-0 left-0 flex items-center pl-2">
                  <svg viewBox="0 0 24 24" class="w-4 h-4 text-gray-500 fill-current">
                    <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z" />
                  </svg>
                </span>
                <input
                  placeholder="Search"
                  class="block w-full py-2 pl-8 pr-6 text-sm text-gray-700 placeholder-gray-400 bg-white border border-b border-gray-400 rounded-l rounded-r appearance-none sm:rounded-l-none focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none"
                  v-model="search"
                  @input="getData"
                />
              </div>
            </div>
          </div>

          <button
            class="flex justify-between items-center px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
            @click="openModal"
          >
            <IcPlus />
            Add
          </button>
        </div>

        <div class="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8">
          <div class="inline-block min-w-full overflow-hidden rounded-lg shadow">
            <table class="min-w-full leading-normal">
              <thead>
                <tr v-if="isLoading">
                  <td colspan="20" class="px-5 py-5 text-sm bg-white border-b border-gray-200">Loading...</td>
                </tr>
                <tr>
                  <th class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Gambar</th>
                  <th class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Kemitraan</th>
                  <th class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Judul</th>
                  <th class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Subjudul</th>
                  <th class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Tanggal</th>
                  <th class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Deskripsi</th>
                  <th class="px-5 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Settings</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="isLoading">
                  <td colspan="20" class="px-5 py-5 text-sm bg-white border-b border-gray-200">Loading...</td>
                </tr>
                <tr v-else v-for="(item, index) in computedData" :key="item.id">
                  <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 w-10 h-10">
                        <img v-if="item?.image" class="w-[50px] h-[50px] rounded-[4px]" :src="item.image" alt="kegiatan image" />
                        <img v-else class="w-[50px] h-[50px] rounded-[4px]" :src="require('@/assets/image/default.png')" alt="default image" />
                      </div>
                    </div>
                  </td>
                  <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                    <p class="text-gray-900 whitespace-nowrap">{{ item?.Kemitraan?.title || item?.kemitraanId }}</p>
                  </td>
                  <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                    <p class="text-gray-900 whitespace-nowrap">{{ item?.title }}</p>
                  </td>
                  <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                    <p class="text-gray-900 whitespace-nowrap">{{ item?.subtitle }}</p>
                  </td>
                  <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                    <p class="text-gray-900 whitespace-nowrap">{{ item?.date }}</p>
                  </td>
                  <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                    <p class="text-gray-900 whitespace-pre-line w-[300px]" style="word-wrap: break-word">{{ truncate(item?.description, 300) }}</p>
                  </td>
                  <td class="px-5 py-5 text-sm bg-white border-b border-gray-200">
                    <div class="flex justify-around">
                      <span class="text-yellow-500 flex justify-center">
                        <button class="mx-2 px-2 rounded-md cursor-pointer" @click.prevent="editItem(item)">
                          <IcEdit />
                        </button>
                        <button type="button" class="mx-2 px-2 rounded-md cursor-pointer" @click.prevent="deleteItem(item.id)">
                          <IcTrash />
                        </button>
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="flex flex-col items-center px-5 py-5 bg-white border-t xs:flex-row xs:justify-between">
              <span class="text-xs text-gray-900 xs:text-sm">
                Showing {{ pagination?.start }} to {{ pagination?.end }} of {{ pagination?.totalEntries }} Entries
              </span>
              <div class="inline-flex mt-2 xs:mt-0">
                <button
                  class="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-300 rounded-l hover:bg-gray-400"
                  :disabled="page <= 1"
                  @click="() => { page = pagination?.currentPage - 1; getData(); }"
                >Prev</button>
                <button
                  class="px-4 py-2 text-sm font-semibold text-gray-800 bg-gray-300 rounded-r hover:bg-gray-400"
                  :disabled="page >= pagination?.totalPages"
                  @click="() => { page = pagination?.currentPage + 1; getData(); }"
                >Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { GET_KEGIATAN_KEMITRAANS, DELETE_KEGIATAN_KEMITRAAN } from "@/store/kegiatanKemitraan.module";
import ModalForm from "../components/modal/FormKegiatanKemitraan.vue";
import { useStore } from 'vuex';
import Breadcrumb from '../partials/AppBreadcrumb.vue';
import Swal from 'sweetalert2';
import { showError } from '@/utils/swal';
import IcTrash from '@/assets/svg/ic-trash.vue';
import IcEdit from '@/assets/svg/ic-edit.vue';
import IcPlus from '@/assets/svg/ic-plus.vue';
import { truncate } from '@/utils';

const store = useStore();

const isOpened = ref(false);
const isLoading = ref(true);
const dataUpdate = ref([]);
const currentId = ref(undefined);
const page = ref(1);
const limit = ref(5);
const search = ref("");
const title = ref("Kegiatan");

const openModal = () => { isOpened.value = true; };

const handleModalClose = async () => {
  isOpened.value = false;
  dataUpdate.value = [];
  currentId.value = undefined;
  await getData();
};

const computedData = computed(() => {
  const data = store.getters.kegiatanKemitraans;
  return data?.data || [];
});

const pagination = computed(() => {
  const data = store.getters.kegiatanKemitraans;
  return data?.pagination || [];
});

const getData = async () => {
  const params = { search: search.value, limit: limit.value, page: page.value };
  try {
    const data = await store.dispatch(GET_KEGIATAN_KEMITRAANS, params);
    return data;
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => { await getData(); });

const editItem = (item: any) => {
  dataUpdate.value = { ...item };
  currentId.value = item.id;
  isOpened.value = true;
};

const deleteItem = async (id: number) => {
  await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await store.dispatch(DELETE_KEGIATAN_KEMITRAAN, { id });
        await Swal.fire({
          title: "Deleted!",
          text: "Your item has been deleted.",
          icon: "success",
          confirmButtonColor: '#4CAF50',
          confirmButtonText: "OK"
        });
        await getData();
      } catch (err: any) {
        showError('Error', err?.response?.data?.message || 'Gagal menghapus data, coba lagi.');
      }
    }
  });
};
</script>
