import type { DemandeStatut } from '@/types';
import Badge from '../ui/Badge';

interface DemandeStatusBadgeProps {
  statut: DemandeStatut;
  size?: 'sm' | 'md' | 'lg';
}

export default function DemandeStatusBadge({ 
  statut, 
  size = 'md' 
}: DemandeStatusBadgeProps) {
  const statusConfig: Record<
    DemandeStatut, 
    { variant: 'info' | 'success' | 'error' | 'warning'; label: string; dot: boolean }
  > = {
    en_recherche: { 
      variant: 'info', 
      label: 'En recherche', 
      dot: true 
    },
    voyageur_trouve: { 
      variant: 'success', 
      label: 'Voyageur trouvé', 
      dot: false 
    },
    annulee: { 
      variant: 'error', 
      label: 'Annulée', 
      dot: false 
    },
    expiree: { 
      variant: 'warning', 
      label: 'Expirée', 
      dot: false 
    },
  };

  const config = statusConfig[statut];

  return (
    <Badge 
      variant={config.variant} 
      size={size} 
      dot={config.dot}
    >
      {config.label}
    </Badge>
  );
}