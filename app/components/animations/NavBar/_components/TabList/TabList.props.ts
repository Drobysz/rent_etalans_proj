import { CursorPosition } from "@/components/animations/NavBar/NavBar.interface";

export interface TabListProps {
	setPosition: ( PosProps : CursorPosition )=> void;
	setPositionClicked: ( PosProps : CursorPosition )=> void;
}
