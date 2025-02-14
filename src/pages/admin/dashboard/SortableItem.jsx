import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "react-router-dom";

function SortableItem({ id, item, index, toggleAvailability, deleteProduct, edithandle }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <tr ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-gray-50 border-b cursor-grab">
            <td className="px-6 py-4">{index + 1}.</td>
            <td className="px-6 py-4">
                <img className="w-16" src={item.imageUrl} alt={item.title} />
            </td>
            <td className="px-6 py-4">{item.title}</td>
            <td className="px-6 py-4">₦{item.price}</td>
            <td className="px-6 py-4">{item.category}</td>
            <td className="px-6 py-4">{item.date}</td>
            <td className="px-6 py-4">
                <button 
                    onClick={() => toggleAvailability(item.id, item.isAvailable)}
                    className={`px-3 py-1 text-white rounded-lg ${item.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}>
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                </button>
            </td>
            <td className="px-6 py-4">
                <div className="flex gap-2">
                    <button onClick={() => deleteProduct(item)} className="text-red-500">🗑</button>
                    <Link to={'/updateproduct'}>
                        <button onClick={() => edithandle(item)} className="text-blue-500">✏️</button>
                    </Link>
                </div>
            </td>
        </tr>
    );
}

export default SortableItem;
