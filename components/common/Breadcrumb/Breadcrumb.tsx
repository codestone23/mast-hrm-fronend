"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import {
  BreadcrumbContainer,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbIcon,
  BreadcrumbText
} from './breadcrumbStyle';

export interface BreadcrumbItemData {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItemData[];
  className?: string;
  showHomeIcon?: boolean;
  separator?: React.ReactNode;
  maxItems?: number;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className,
  showHomeIcon = true,
  separator = <ChevronRight size={14} />,
  maxItems
}) => {
  const router = useRouter();

  const handleClick = (item: BreadcrumbItemData, index: number) => {
    if (index === items.length - 1) {
      // Don't navigate if it's the last item (current page)
      return;
    }

    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      router.push(item.href);
    }
  };

  // Truncate items if maxItems is specified
  let displayItems = items;
  if (maxItems && items.length > maxItems) {
    const firstItem = items[0];
    const lastItems = items.slice(-maxItems + 1);
    displayItems = [
      firstItem,
      { label: '...', href: undefined },
      ...lastItems
    ];
  }

  return (
    <BreadcrumbContainer className={className}>
      <BreadcrumbList>
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isEllipsis = item.label === '...';
          
          return (
            <React.Fragment key={`${item.label}-${index}`}>
              <BreadcrumbItem $isLast={isLast}>
                {isEllipsis ? (
                  <BreadcrumbText>...</BreadcrumbText>
                ) : isLast ? (
                  <>
                    {item.icon && (
                      <BreadcrumbIcon>
                        {item.icon}
                      </BreadcrumbIcon>
                    )}
                    {showHomeIcon && index === 0 && !item.icon && (
                      <BreadcrumbIcon>
                        <Home size={16} />
                      </BreadcrumbIcon>
                    )}
                    <BreadcrumbText title={item.label}>
                      {item.label}
                    </BreadcrumbText>
                  </>
                ) : (
                  <BreadcrumbLink
                    onClick={() => handleClick(item, index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleClick(item, index);
                      }
                    }}
                  >
                    {item.icon && (
                      <BreadcrumbIcon>
                        {item.icon}
                      </BreadcrumbIcon>
                    )}
                    {showHomeIcon && index === 0 && !item.icon && (
                      <BreadcrumbIcon>
                        <Home size={16} />
                      </BreadcrumbIcon>
                    )}
                    <BreadcrumbText title={item.label}>
                      {item.label}
                    </BreadcrumbText>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              
              {!isLast && (
                <BreadcrumbSeparator>
                  {separator}
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </BreadcrumbContainer>
  );
};

export default Breadcrumb;
