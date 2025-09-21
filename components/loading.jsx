import React from "react";
import { Loader2 } from "lucide-react";

const Loading = ({ 
  size = "default", 
  text = "Loading...", 
  className = "",
  showText = true 
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`animate-spin ${sizeClasses[size] || sizeClasses.default}`} />
      {showText && (
        <span className="text-muted-foreground">
          {text}
        </span>
      )}
    </div>
  );
};

export default Loading;

export const PageLoading = ({ text = "Loading page..." }) => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <Loading size="lg" text={text} />
  </div>
);

export const InlineLoading = ({ text = "Loading..." }) => (
  <Loading size="sm" text={text} />
);

export const ButtonLoading = () => (
  <Loader2 className="w-4 h-4 animate-spin" />
);
