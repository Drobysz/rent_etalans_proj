export interface CursorPosition {
    left: number;
    width: number;
};

export interface CursorProps {
    position: CursorPosition;
    isActive: boolean;
};

export interface StayInputprops {
    activeFormId: number;
    setPosition: ( PosProps : CursorPosition )=> void;
    setPositionClicked: ( PosProps : CursorPosition )=> void;
};