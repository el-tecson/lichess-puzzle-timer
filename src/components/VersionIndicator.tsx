import "@/styles/components/version-indicator.css";
import { VERSION } from "@/constants";

export default function VersionIndicator({...props}) {
    return (
        <p className="lpt-version-indicator" {...props}>
            {VERSION}
        </p>
    )
}