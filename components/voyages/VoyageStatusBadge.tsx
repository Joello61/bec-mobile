import type { VoyageStatut } from '@/types';
import Badge from '../ui/Badge';

interface VoyageStatusBadgeProps {
  statut: VoyageStatut;
  size?: 'sm' | 'md' | 'lg';
}

export default function VoyageStatusBadge({ 
  statut, 
  size = 'md' 
}: VoyageStatusBadgeProps) {
  const statusConfig: Record<
  VoyageStatut,
  { variant: 'success' | 'warning' | 'neutral' | 'error'; label: string; dot: boolean }
> = {
  actif: { 
    variant: 'success', 
    label: 'Actif', 
    dot: true 
  },
  complete: { 
    variant: 'warning', 
    label: 'Complet', 
    dot: false 
  },
  en_cours: { 
    variant: 'neutral', 
    label: 'Terminé', 
    dot: false 
  },
  annule: { 
    variant: 'error', 
    label: 'Annulé', 
    dot: false 
  },
  expire: { 
    variant: 'warning', 
    label: 'Expiré', 
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