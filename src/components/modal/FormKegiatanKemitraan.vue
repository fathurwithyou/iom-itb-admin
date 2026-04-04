<template>
  <div class="fixed z-[998] bg-black top-0 right-0 w-full h-screen opacity-[0.4]"></div>
  <div class="fixed z-[999] flex justify-center items-center w-screen h-screen top-0 right-0" @click="closeModal">
    <div ref="modalContent" @click.stop>
      <div class="md:w-[500px] max-w-[500px] overflow-hidden bg-white border rounded-md shadow-md">
        <form @submit.prevent="handleSubmit">
          <div class="flex items-center justify-between px-5 py-3 text-gray-700 border-b">
            <h3 class="text-sm capitalize">{{ title }}</h3>
            <button type="button" @click="closeModal">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="px-5 py-6 text-gray-700 bg-gray-200 border-b max-h-[80vh] overflow-y-scroll">
            <!-- Kemitraan dropdown -->
            <div class="relative mt-2 rounded-md shadow-sm">
              <label class="text-sm">Kemitraan *</label>
              <select
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-1"
                v-model="selectedKemitraanId"
                required
                @change="onKemitraanChange"
              >
                <option value="" disabled>-- Pilih Kemitraan --</option>
                <option v-for="k in kemitraanList" :key="k.id" :value="k.id">{{ k.title }}</option>
              </select>
            </div>

            <InputText label="Judul" keyValue="title" :value="data?.title" @update="updateValue" />
            <InputText label="Subjudul" keyValue="subtitle" :value="data?.subtitle" @update="updateValue" />
            <InputDate label="Tanggal" keyValue="date" :value="data?.date" @update="updateValue" />
            <InputTextArea label="Deskripsi" keyValue="description" :value="data?.description" @update="updateValue" />
            <InputImageCostume label="Gambar" keyValue="image" :value="data?.image || ''" @update="updateValue" />
          </div>

          <div class="flex items-center justify-between px-5 py-3">
            <button type="button" @click="closeModal" class="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none">
              Cancel
            </button>
            <button type="submit" :disabled="isLoading" class="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none">
              {{ isLoading ? 'Loading...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import InputText from '@/components/input/InputText.vue';
import InputDate from '@/components/input/InputDate.vue';
import InputTextArea from '@/components/input/InputTextArea.vue';
import InputImageCostume from '@/components/input/InputImageCostume.vue';
import { useStore } from 'vuex';
import { POST_KEGIATAN_KEMITRAAN, PUT_KEGIATAN_KEMITRAAN } from "@/store/kegiatanKemitraan.module";
import { GET_KEMITRAANS } from "@/store/kemitraan.module";
import { POST_IMAGE } from "@/store/upload.module";

export default defineComponent({
  components: { InputText, InputDate, InputTextArea, InputImageCostume },
  props: {
    title: { type: String, required: true },
    id: { type: String, required: false },
    data: { type: Object, required: false, default: () => ({}) }
  },
  setup(props, { emit }) {
    const store = useStore();
    const modalContent = ref(null);
    const isLoading = ref(false);
    const selectedKemitraanId = ref(props.data?.kemitraanId || '');

    const kemitraanList = computed(() => {
      const kemitraans = store.getters.kemitraans;
      return kemitraans?.data || [];
    });

    onMounted(async () => {
      await store.dispatch(GET_KEMITRAANS, { limit: 100, page: 1, search: '' });
      if (props.data?.kemitraanId) {
        selectedKemitraanId.value = props.data.kemitraanId;
      }
    });

    const closeModal = () => {
      isLoading.value = false;
      emit('close');
    };

    const formData = {
      id: '',
      data: {} as Record<string, any>
    };

    const updateValue = (params: { key: string; value: any }) => {
      formData.data[params.key] = params.value;
    };

    const onKemitraanChange = () => {
      formData.data.kemitraanId = selectedKemitraanId.value;
    };

    const handleSubmit = async () => {
      isLoading.value = true;
      try {
        formData.data.kemitraanId = selectedKemitraanId.value;

        if (formData?.data?.image) {
          if (typeof formData?.data?.image !== "string") {
            const response = await store.dispatch(POST_IMAGE, formData);
            formData.data.image = response || "";
          }
          formData.data.image = formData?.data?.image || "";
        }

        if (props?.id) {
          formData.id = props?.id;
          await store.dispatch(PUT_KEGIATAN_KEMITRAAN, formData);
        } else {
          await store.dispatch(POST_KEGIATAN_KEMITRAAN, formData);
        }
        closeModal();
      } catch (error: any) {
        alert(error?.response?.data?.message);
        isLoading.value = false;
      }
    };

    return {
      modalContent,
      closeModal,
      handleSubmit,
      updateValue,
      onKemitraanChange,
      selectedKemitraanId,
      kemitraanList,
      isLoading
    };
  },
});
</script>
