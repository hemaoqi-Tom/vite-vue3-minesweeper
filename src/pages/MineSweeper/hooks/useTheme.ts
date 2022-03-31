import { ref, watch } from 'vue';

export function useTheme() {
  const theme = ref<'light' | 'dark'>('light');
  const changeThemeSwitch = ref(false);

  watch(changeThemeSwitch, (newValue) => {
    if (newValue) {
      theme.value = 'dark';
    } else {
      theme.value = 'light';
    }
  });

  return { theme, changeThemeSwitch };
}
