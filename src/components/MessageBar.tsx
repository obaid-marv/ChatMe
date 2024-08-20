

const MessageBar = (props) => {
  

  return (
    <>
        <div className="w-full bg-gray-200 h-16 rounded-lg py-1 px-3 flex flex-col shadow-md justify-center hover:scale-95 trasnform-all cursor-pointer duration-300 mt-2"
        onClick={props.onClick} 
        >
            <p className="text-xl font-bold">{props.name}</p>
            <p className="text-sm">{props.otherUserId==props.senderId?props.content:"You: "+props.content}</p>
        </div>

    </>
  );
};

export default MessageBar;
