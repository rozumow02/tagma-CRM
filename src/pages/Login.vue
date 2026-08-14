<template>
  <div class="min-h-screen flex items-center">
    <div class="w-full p-8">
      <div class="flex justify-center">
        <div class="min-w-xl">
          <div class="text-center mb-8">
            <img
              src="@/assets/images/tagma_logo.png"
              alt="Tagma Logo"
              class="mx-auto h-16 mb-2"
            />
            <h1 class="text-3xl font-semibold text-main mb-2">Tagma</h1>
          </div>
          <div class="bg-white shadow-md rounded-lg p-6 w-96 mx-auto">
            <form @submit.prevent="handleSubmit">
              <div class="mb-4">
                <label
                  for="username"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Логин
                </label>
                <input
                  id="username"
                  v-model="username"
                  placeholder="Введите логин"
                  type="text"
                  required
                  class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-main"
                  :class="{ 'border-red-500': username && !isUsernameValid }"
                />
                <p
                  v-if="username && !isUsernameValid"
                  class="text-red-500 text-sm mt-1"
                >
                  {{ Trans.t("rules.invalid_username") }}
                </p>
              </div>
              <div class="mb-6">
                <label
                  for="password"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Пароль
                </label>
                <div class="relative">
                  <input
                    id="password"
                    placeholder="Введите пароль"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-main pr-10"
                  />
                  <button
                    type="button"
                    @click="togglePasswordVisibility"
                    class="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    <EyeIcon
                      v-if="!showPassword"
                      class="h-5 w-5 text-gray-400"
                    />
                    <EyeOffIcon v-else class="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>
              <button
                v-loading.lock="loading"
                type="submit"
                class="w-full bg-main text-white py-2 px-4 rounded-md"
              >
                Войти
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { EyeIcon, EyeOffIcon } from "lucide-vue-next";
import { useAuthStore, loading } from "@/store/auth";
import { isValidUsername } from "@/utils/validators";
import Trans from "@/i18n/translation";

const { FETCH_LOGIN } = useAuthStore();

const username = ref("");
const password = ref("");
const showPassword = ref(false);

const isUsernameValid = computed(() => isValidUsername(username.value));

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleSubmit = async () => {
  if (!isUsernameValid.value) return;
  loading.value = true;
  try {
    await FETCH_LOGIN({ username: username.value, password: password.value });
  } finally {
    loading.value = false;
  }
};
</script>
