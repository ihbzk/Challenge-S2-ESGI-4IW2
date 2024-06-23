import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const isAuthenticated = ref(false);
const authToken = ref('');
const message = ref('');
const isError = ref(false);
let intervalId = null;

/**
 * Vérifie si l'utilisateur est authentifié
 * Pour l'utiliser, il faut appeler cette fonction dans un composant => 
 * 
 *  import useAuth from '@/composables/useAuth';
 *
 *  const { isAuthenticated, initializeAuth } = useAuth();
 *
 *  initializeAuth();
 * 
 */
const checkAuth = async () => {
    try {
        const storedToken = localStorage.getItem('authToken');
        if (!storedToken) {
            isAuthenticated.value = false;

            return;
        }

        const response = await fetch(`http://${import.meta.env.VITE_HOST}:${import.meta.env.VITE_PORT_BACKEND}/me`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${storedToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données utilisateur');
        }

        isAuthenticated.value = true;
        isError.value = false;
        message.value = '';
    } catch (error) {
        handleAuthError(error);
    }
};

const handleAuthError = (error) => {
    message.value = error.message;
    isError.value = true;
    console.error('Échec de la vérification de l\'authentification', error);
    isAuthenticated.value = false;
    authToken.value = '';
    localStorage.removeItem('authToken');
};

const setAuthToken = (token) => {
    authToken.value = token;
    localStorage.setItem('authToken', token);
};

const startAuthCheck = () => {
    // Vérification initiale
    const storedToken = localStorage.getItem('authToken');
    const router = useRouter();
    
    if (storedToken) {
        setAuthToken(storedToken);
        checkAuth();
    } else {
        isAuthenticated.value = false;
        router.push({ name: 'Login' });
    }

    // Intervalle de vérification
    intervalId = setInterval(async () => {
        const storedToken = localStorage.getItem('authToken');

        if (!storedToken) {
            isAuthenticated.value = false;
            router.push({ name: 'Login' });
        } else {
            await checkAuth();

            if (!isAuthenticated.value) {
                router.push({ name: 'Login' });
            }
        }
    }, import.meta.env.VITE_AUTH_CHECK_INTERVAL);
};

const stopAuthCheck = () => {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
};

const initializeAuth = () => {
    onMounted(() => {
        startAuthCheck();
    });

    onUnmounted(() => {
        stopAuthCheck();
    });
};

const useAuth = () => {
    return {
        isAuthenticated,
        authToken,
        message,
        isError,
        checkAuth,
        setAuthToken,
        initializeAuth,
    };
};

export default useAuth;
