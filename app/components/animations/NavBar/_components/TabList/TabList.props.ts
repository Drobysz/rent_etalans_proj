import { CursorPosition } from "@/components/animations/NavBar/types";

export interface TabListProps {
	setPosition: ( PosProps : CursorPosition )=> void;
	setPositionClicked: ( PosProps : CursorPosition )=> void;
}
