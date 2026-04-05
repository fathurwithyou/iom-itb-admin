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
            <InputText label="Judul" keyValue="name" :value="data?.name" @update="updateValue" />
            <InputTextArea label="Deskripsi" keyValue="description" :value="data?.description" @update="updateValue" />
            <InputImageCostume label="Gambar" keyValue="image" :value="data?.image || ''" @update="updateValue" />

            <!-- MoU PDF Upload -->
            <div class="relative mt-2 rounded-md shadow-sm">
              <label class="text-sm">Upload MoU (PDF)</label>
              <div class="mt-2">
                <input
                  type="file"
                  accept="application/pdf"
                  @change="onPdfChange"
                  class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />
              </div>
              <div v-if="mouFileName" class="mt-2 text-xs text-gray-600">
                File terpilih: {{ mouFileName }}
              </div>
              <div v-else-if="data?.mou" class="mt-2 text-xs text-gray-600">
                File saat ini: <a :href="data.mou" target="_blank" class="text-blue-600 underline">Lihat MoU</a>
              </div>
            </div>
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
import { defineComponent, ref } from 'vue';
import InputText from '@/components/input/InputText.vue';
import InputTextArea from '@/components/input/InputTextArea.vue';
import InputImageCostume from '@/components/input/InputImageCostume.vue';
import { useStore } from 'vuex';
import { POST_KEMITRAAN, PUT_KEMITRAAN } from "@/store/kemitraan.module";
import { POST_IMAGE, POST_PDF } from "@/store/upload.module";

export default defineComponent({
  components: { InputText, InputTextArea, InputImageCostume },
  props: {
    title: { type: String, required: true },
    id: { type: String, required: false },
    data: { type: Object, required: false, default: () => ({}) }
  },
  setup(props, { emit }) {
    const store = useStore();
    const modalContent = ref(null);
    const isLoading = ref(false);
    const mouFile = ref<File | null>(null);
    const mouFileName = ref('');

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

    const onPdfChange = (event: Event) => {
      const fileInput = event.target as HTMLInputElement;
      if (fileInput.files && fileInput.files[0]) {
        mouFile.value = fileInput.files[0];
        mouFileName.value = fileInput.files[0].name;
      }
    };

    const handleSubmit = async () => {
      isLoading.value = true;
      try {
        if (formData?.data?.image) {
          if (typeof formData?.data?.image !== "string") {
            const response = await store.dispatch(POST_IMAGE, formData);
            formData.data.image = response || "";
          }
          formData.data.image = formData?.data?.image || "";
        }

        if (mouFile.value) {
          const pdfFormData = new FormData();
          pdfFormData.append('file', mouFile.value);
          const mouUrl = await store.dispatch(POST_PDF, { data: pdfFormData });
          formData.data.mou = mouUrl || "";
        }

        if (props?.id) {
          formData.id = props?.id;
          await store.dispatch(PUT_KEMITRAAN, formData);
        } else {
          await store.dispatch(POST_KEMITRAAN, formData);
        }
        closeModal();
      } catch (error: any) {
        alert(error?.response?.data?.message);
        isLoading.value = false;
      }
    };

    return { modalContent, closeModal, handleSubmit, updateValue, onPdfChange, mouFileName, isLoading };
  },
});
</script>
