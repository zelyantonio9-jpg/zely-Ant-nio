import React from 'react';
import { LegalAndGovernanceModal } from './LegalAndGovernanceModal';

interface EcosystemRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'terms' | 'privacy' | 'governance';
}

export const EcosystemRulesModal: React.FC<EcosystemRulesModalProps> = ({ 
  isOpen, 
  onClose,
  initialTab = 'governance'
}) => {
  return (
    <LegalAndGovernanceModal
      isOpen={isOpen}
      onClose={onClose}
      initialTab={initialTab}
    />
  );
};
