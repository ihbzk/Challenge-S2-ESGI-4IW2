import { ref } from 'vue'

const isSearchBarOpen = ref(false)

export function useSearchBar() {
    function openSearchBar() {
        isSearchBarOpen.value = true
    }

    function closeSearchBar() {
        isSearchBarOpen.value = false
    }

    return {
        isSearchBarOpen,
        openSearchBar,
        closeSearchBar,
    }
}