import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { Mail, Smartphone, RefreshCw } from 'lucide-react-native';

// Composants UI
import Modal, { ModalFooter } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

// Hooks
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils/cn';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'email' | 'phone';
  contactInfo?: string;
  onSuccess?: () => void;
}

export default function VerificationModal({
  isOpen,
  onClose,
  type,
  contactInfo,
  onSuccess,
}: VerificationModalProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);
  
  // Références pour gérer le focus des 6 inputs
  const inputRefs = useRef<Array<TextInput | null>>([]);
  
  const toast = useToast();
  
  // On suppose que le hook useAuth expose ces méthodes (à adapter si besoin)
  // Note: pendingEmail n'est peut-être pas dispo sur mobile si le state a été perdu
  // C'est mieux d'utiliser contactInfo passé en prop.
  const { verifyEmail, verifyPhone, resendVerification } = useAuth();

  const Icon = type === 'email' ? Mail : Smartphone;
  const title = type === 'email' ? 'Vérification de l\'email' : 'Vérification du téléphone';
  const description = type === 'email' 
    ? `Un code à 6 chiffres a été envoyé à ${contactInfo || 'votre email'}`
    : `Un code à 6 chiffres a été envoyé par SMS au ${contactInfo || 'votre numéro'}`;

  // Gestion du compte à rebours
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  // Auto-focus sur le premier champ à l'ouverture
  useEffect(() => {
    if (isOpen) {
      // Petit délai pour laisser le temps à la modal de s'afficher
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Gestion de la saisie d'un chiffre
  const handleChange = (index: number, value: string) => {
    // Sur mobile, value peut être tout le texte collé, mais on prend juste le dernier char
    // Si l'utilisateur tape un chiffre
    if (/^\d$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Passer au suivant
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      } else {
        // Dernier chiffre rempli, on ferme le clavier
        Keyboard.dismiss();
      }
    } else if (value === '') {
      // Cas où on efface via le clavier virtuel (si supporté par l'OS sans onKeyPress)
      const newCode = [...code];
      newCode[index] = '';
      setCode(newCode);
    }
  };

  // Gestion du Backspace (Effacer et revenir en arrière)
  const handleKeyPress = (index: number, e: any) => {
    if (e.nativeEvent.key === 'Backspace') {
      // Si la case est vide et qu'on n'est pas au début, on recule
      if (!code[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        // Optionnel : effacer aussi la case précédente
        const newCode = [...code];
        newCode[index - 1] = '';
        setCode(newCode);
      }
    }
  };

  const handleSubmit = async () => {
    const fullCode = code.join('');
    
    if (fullCode.length !== 6) {
      toast.show({ type: 'error', title: 'Erreur', message: 'Veuillez entrer les 6 chiffres' });
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (type === 'email') {
        await verifyEmail(fullCode, contactInfo || '');
        toast.show({ type: 'success', title: 'Succès', message: 'Email vérifié avec succès !' });
      } else {
        await verifyPhone(fullCode);
        toast.show({ type: 'success', title: 'Succès', message: 'Téléphone vérifié avec succès !' });
      }
      
      if (onSuccess) {
        onSuccess();
      }
      
      onClose();
      setCode(['', '', '', '', '', '']);
    } catch (error: any) {
      toast.show({ 
        type: 'error', 
        title: 'Code invalide', 
        message: error.message || 'Le code entré est incorrect' 
      });
      // Reset code et focus
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setCanResend(false);
    setCountdown(60);
    
    try {
      if (type === 'email') {
        await resendVerification('email', contactInfo || '');
      } else {
        await resendVerification('phone');
      }
      
      toast.show({ type: 'success', title: 'Envoyé', message: 'Code renvoyé avec succès !' });
      // Reset input
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      toast.show({ type: 'error', title: 'Erreur', message: error.message || 'Erreur lors du renvoi' });
      setCanResend(true);
      setCountdown(0);
    } finally {
      setIsResending(false);
    }
  };

  const isCodeComplete = code.every(digit => digit !== '');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      // On empêche la fermeture si on est en train de soumettre
      closeOnOverlayClick={!isSubmitting}
    >
      <View className="p-6 items-center">
        
        {/* Icone & Titre */}
        <View className="w-16 h-16 bg-primary/10 rounded-full items-center justify-center mb-4">
          <Icon size={32} color="#00695c" />
        </View>
        
        <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
          {title}
        </Text>
        
        <Text className="text-gray-600 text-sm text-center mb-8 px-4">
          {description}
        </Text>

        {/* Inputs Code (6 chiffres) */}
        <View className="flex-row gap-2 justify-center mb-8 w-full">
          {code.map((digit, index) => (
            <TextInput
              key={index}
              // ✅ CORRECTION : Ajout des accolades pour ne rien retourner (void)
              ref={(el) => { inputRefs.current[index] = el; }}
              className={cn(
                "w-11 h-14 text-center text-2xl font-bold border-2 rounded-lg text-gray-900 bg-gray-50",
                digit ? "border-primary bg-white" : "border-gray-200"
              )}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(value) => handleChange(index, value)}
              onKeyPress={(e) => handleKeyPress(index, e)}
              editable={!isSubmitting}
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Lien Renvoyer */}
        <View className="mb-6">
          <Text className="text-sm text-gray-600 text-center mb-2">
            Vous n&apos;avez pas reçu le code ?
          </Text>
          
          <TouchableOpacity
            onPress={handleResend}
            disabled={!canResend || isResending}
            className="flex-row items-center justify-center"
          >
            {isResending ? (
              <Text className="text-primary font-medium ml-2">Envoi...</Text>
            ) : canResend ? (
              <>
                <RefreshCw size={14} color="#00695c" />
                <Text className="text-primary font-bold ml-2">Renvoyer le code</Text>
              </>
            ) : (
              <Text className="text-gray-400 font-medium">
                Renvoyer dans {countdown}s
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer Actions */}
        <ModalFooter className="w-full border-t-0 bg-transparent px-0 pb-0">
          <View className="flex-row gap-3 w-full">
            <View className="flex-1">
              <Button
                variant="outline"
                onPress={onClose}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
            </View>
            <View className="flex-1">
              <Button
                variant="primary"
                onPress={handleSubmit}
                disabled={!isCodeComplete || isSubmitting}
                isLoading={isSubmitting}
              >
                Vérifier
              </Button>
            </View>
          </View>
        </ModalFooter>

      </View>
    </Modal>
  );
}