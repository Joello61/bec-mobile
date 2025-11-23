import React from 'react';
import Button from '@/components/ui/Button';
import FacebookLogo from '@/assets/images/social/facebook.svg';

interface FacebookSignInButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function FacebookSignInButton({ 
  onPress, 
  isLoading, 
  disabled 
}: FacebookSignInButtonProps) {
  return (
    <Button
      variant="primary" 
      className="bg-[#1877F2] border-[#1877F2]"
      onPress={onPress}
      isLoading={isLoading}
      disabled={disabled}
      leftIcon={<FacebookLogo width={20} height={20} fill="white" />}
    >
      Facebook
    </Button>
  );
}