import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Library } from "lucide-react"
import AddAlbumDialog from "./AddAlbumDialog"
import AlbumTable from "./AlbumTable"

const AlbumsTabContent = () => {
  return (
    <Card className="bg-zinc-800/50 border-zinc-700/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-cente gap-2">
							<Library className='h-5 w-5 text-violet-500' />
              Albums Library
              </CardTitle>
            </div>
            <AddAlbumDialog/>
          </div>
        </CardHeader>

        <CardContent>
          <AlbumTable/>
        </CardContent>
    </Card>
  )
}

export default AlbumsTabContent