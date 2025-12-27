import CopyChip from "../../../components/CopyChip"

export default function GamePathCopyChip() {
    return (
        <div className="flex flex-wrap items-center gap-4">
            <CopyChip title="Steam" text="steam://rungameid/<game id>" />
            <CopyChip title="EA Games" text="ealaunch://<gameid>" />
            <CopyChip title="Ubisoft" text="uplay://launch/<gameID>/0" />
            <CopyChip title="Xbox" text="xbox://<something>" />
            <CopyChip
                title="Epic Games"
                text="com.epicgames.launcher://apps/<appname>?action=launch"
            />
        </div>
    )
}