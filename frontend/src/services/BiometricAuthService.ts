import { AndroidBiometryStrength, AuthenticateOptions, BiometricAuth, BiometryError, BiometryErrorType, CheckBiometryResult } from "@aparajita/capacitor-biometric-auth";
import { toast } from "react-toastify";
import firebaseAuthService from "./FirebaseAuthService";

class BiometricAuthService {

    private async checkBiometry(): Promise<boolean> {
        BiometricAuth.setDeviceIsSecure(true) // ! WEB ONLY
        const info: CheckBiometryResult = await BiometricAuth.checkBiometry();
        return true; // ! WEB ONLY
        return !!info.isAvailable && !!info.deviceIsSecure
    }

    public async authenticate(): Promise<void> {
        if (!this.checkBiometry()) { toast.error("Biometric authentication is not available"); return; }
        try {
            await BiometricAuth.authenticate(this.buildBiometricConfig())
            // ? DEMO

            firebaseAuthService.signInUser("email@gmail.com", "123456");
        } catch (error) {
            if (error instanceof BiometryError) {
                toast.error(error.message)
                if (error.code !== BiometryErrorType.userCancel) {
                    toast.error(error.message)
                }
            }
        }
    }

    private buildBiometricConfig(): AuthenticateOptions {
        return {
            reason: '',
            cancelTitle: 'Cancelar',
            allowDeviceCredential: true,
            iosFallbackTitle: 'Usa PIN',
            androidTitle: 'Inicia sesión en VIIO',
            androidSubtitle: 'Inicia sesión usando autenticación biométrica',
            androidConfirmationRequired: false,
            androidBiometryStrength: AndroidBiometryStrength.weak,
        }
    }

}

const biometricAuthService = new BiometricAuthService();
export default biometricAuthService;