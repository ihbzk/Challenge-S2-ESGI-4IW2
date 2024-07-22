// useAuth.ts
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const isAuthenticated = ref<boolean>(false);
const authToken = ref<string>('');
const message = ref<string>('');
const isError = ref<boolean>(false);
const user = ref<User | null>(null); // Stocker l'objet utilisateur complet
let intervalId: number | null = null;

const checkAuth = async (): Promise<void> => {
    try {
        const storedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

        if (!storedToken) {
            isAuthenticated.value = false;
            user.value = null;
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

        const data = await response.json();
        isAuthenticated.value = true;
        user.value = {
          id: data.id,
          role: data.role,
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
        };
        isError.value = false;
        message.value = '';
    } catch (error) {
        handleAuthError(error);
    }
};

const handleAuthError = (error: Error): void => {
    message.value = error.message;
    isError.value = true;
    console.error('Échec de la vérification de l\'authentification', error);
    isAuthenticated.value = false;
    authToken.value = '';
    user.value = null;
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
};

const setAuthToken = (token: string, rememberMe: boolean): void => {
    authToken.value = token;
    if (rememberMe) {
        localStorage.setItem('authToken', token);
    } else {
        sessionStorage.setItem('authToken', token);
    }
};

const startAuthCheck = (): void => {
    const storedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const router = useRouter();
    
    if (storedToken) {
        authToken.value = storedToken;
        checkAuth();
    } else {
        isAuthenticated.value = false;
        user.value = null;
        router.push({ name: 'Login' });
    }

    intervalId = window.setInterval(async () => {
        const storedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

        if (!storedToken) {
            isAuthenticated.value = false;
            user.value = null;
            router.push({ name: 'Login' });
        } else {
            await checkAuth();

            if (!isAuthenticated.value) {
                router.push({ name: 'Login' });
            }
        }
    }, import.meta.env.VITE_AUTH_CHECK_INTERVAL);
};

const stopAuthCheck = (): void => {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
};

const initializeAuth = (): void => {
    onMounted(() => {
        startAuthCheck();
    });

    onUnmounted(() => {
        stopAuthCheck();
    });
};

const hasRole = (requiredRole: string): boolean => {
    return user.value?.role === requiredRole;
};

const hasAnyRole = (requiredRoles: string[]): boolean => {
    return requiredRoles.includes(user.value?.role ?? '');
};

const useAuth = () => {
    return {
        isAuthenticated,
        authToken,
        message,
        isError,
        user,
        checkAuth,
        setAuthToken,
        initializeAuth,
        hasRole,
        hasAnyRole,
    };
};

export default useAuth;
