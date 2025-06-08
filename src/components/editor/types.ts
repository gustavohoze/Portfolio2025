export interface CodeLine {
  indent: number;
  text: string;
  color: string;
}

export interface EditorViewProps {
  isActive: boolean;
  isDark: boolean;
}

export interface EditorTabProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  isDark: boolean;
}

export interface EditorHeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isDark: boolean;
}

export interface EditorProps {
  initialView?: string;
  views: {
    [key: string]: {
      component: React.ComponentType<EditorViewProps>;
      label: string;
      icon: React.ReactNode;
      filename: string;
    };
  };
  isDark: boolean;
} 