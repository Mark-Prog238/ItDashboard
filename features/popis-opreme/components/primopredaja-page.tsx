import {Button} from "@/components/ui/button";
import {handleDownload} from "@/features/popis-opreme/functions/popis-opreme-function-download-client";
import PrimopredajaCard from "@/features/popis-opreme/components/primopredaja-card";
/*export default function DownloadButton() {

    return (E
        <Button onClick={handleDownload} >
            Generiraj in prenesi DOCX
        </Button>
    );
}*/

export default function DownloadFileFormPopup() {
    return (
        <Button  >
            Pripravi dokument
            <PrimopredajaCard/>
        </Button>
    );
}