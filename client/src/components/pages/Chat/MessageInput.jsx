import { AnimatePresence, motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { modalActions } from "../../../store/modalSlice";
import useSendMessage from "../../../hooks/useSendMessage";

function MessageInput({
  isRecording,
  handleInput,
  messageEmpty,
  getCaretIndex,
  emitTypingEvent,
  setMessageEmpty,
}) {
  const dispatch = useDispatch();
  const { sendMessage } = useSendMessage(setMessageEmpty);

  const terminateRecording = (event) => {
    getCaretIndex(event);
    if (isRecording) {
      event.currentTarget.blur();
      dispatch(modalActions.openModal({ type: "stopRecordModal" }));
    }
  };

  const handleKeyDown = (event) => {
    if (messageEmpty) return;

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent the default action (new line)
      sendMessage();
    } else if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      // Insert a new line
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);

      // Create a new line element
      const br = document.createElement("br");
      range.insertNode(br);
      range.setStartAfter(br);
      range.setEndAfter(br);

      // Move the caret to the new line
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      emitTypingEvent(event); // Call existing typing event handler
    }
  };

  return (
    <div
      onClick={(event) => {
        event.currentTarget.querySelector("#messageInput").click();
      }}
      className="ml-[1rem] flex-grow min-h-[4rem] flex items-center group relative overflow-x-hidden"
    >
      {/* Placeholder */}
      <AnimatePresence>
        {messageEmpty && (
          <motion.span
            initial={{ left: 40, opacity: 0 }}
            animate={{ left: 0, opacity: 1, transition: { duration: 0.3 } }}
            exit={{ left: 40, opacity: 0, transition: { duration: 0.3 } }}
            className="text-secondary-text absolute top-1/2 -translate-y-1/2 left-0"
          >
            Message
          </motion.span>
        )}
      </AnimatePresence>
      {/* Input */}
      <div
        id="messageInput"
        className="outline-none flex-grow z-10 max-h-[16rem] overflow-y-scroll custom-scrollbar overflow-x-hidden whitespace-pre-wrap"
        contentEditable={true}
        onInput={handleInput}
        onClick={terminateRecording}
        onFocus={getCaretIndex}
        onKeyDown={handleKeyDown} // Updated handler
      ></div>
    </div>
  );
}

export default MessageInput;
