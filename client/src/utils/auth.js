import decode from "jwt-decode";

class AuthService {
    getUser() {
        try {
            return decode(this.getToken());
        } catch (err) {
            console.log(err);
        }
    }

    loggedIn() {
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token);
    }

    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            return decoded.exp < Date.now() / 1000;
        } catch (err) {
            return false;
        }
    }

    getToken() {
        return localStorage.getItem("id_token");
    }

    login(idToken) {
        localStorage.setItem("id_token", idToken);
        window.location.assign("/");
    }

    logout() {
        localStorage.removeItem("id_token");
        window.location.assign("/login");
    }
}

export default new AuthService();