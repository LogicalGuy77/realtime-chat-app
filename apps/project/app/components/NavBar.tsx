
import { MessageCircle } from 'lucide-react'
const NavBar = () => {
    return (
        <div className="bg-neutral-900 flex items-center gap-x-2 pl-4 pt-4">
            <MessageCircle className="text-white text-xl" />
            <h1 className="bg-neutral-900 text-xl  text-white">Collab Space</h1>
        </div>
    )
}

export default NavBar