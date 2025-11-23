import React from 'react';
import Button from '@/components/ui/Button';
import GoogleLogo from '@/assets/images/social/google.svg';

interface GoogleSignInButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function GoogleSignInButton({ 
  onPress, 
  isLoading, 
  disabled 
}: GoogleSignInButtonProps) {
  return (
    <Button
      variant="outline"
      onPress={onPress}
      isLoading={isLoading}
      disabled={disabled}
      className="bg-white border-gray-300"
      leftIcon={<GoogleLogo width={20} height={20} />}
    >
      Google
    </Button>
  );
}