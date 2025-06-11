
"use client";

import React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconByNameProps extends LucideIcons.LucideProps {
  name?: string;
  fallbackIcon?: LucideIcons.LucideIcon;
}

const IconByName: React.FC<IconByNameProps> = ({ name, fallbackIcon: FallbackIcon = LucideIcons.AlertCircle, ...props }) => {
  if (!name) {
    return <FallbackIcon {...props} />;
  }

  const IconComponent = (LucideIcons as any)[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in lucide-react. Falling back to default.`);
    return <FallbackIcon {...props} />;
  }

  return <IconComponent {...props} />;
};

export default IconByName;
