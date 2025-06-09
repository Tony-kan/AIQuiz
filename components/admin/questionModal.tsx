// import React, { useState, useEffect } from "react";
// import { IQuestion } from "@/type/type";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { toast } from "sonner";

// interface QuestionModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   quizId: string;
//   questionData: IQuestion | null;
//   onSave: () => void;
// }

// const initialFormState = {
//   questionText: "",
//   options: ["", "", "", ""],
//   correctAnswerIndex: 0,
// };

// export const QuestionModal = ({
//   isOpen,
//   onClose,
//   quizId,
//   questionData,
//   onSave,
// }: QuestionModalProps) => {
//   const [formState, setFormState] = useState(initialFormState);
//   const [isSaving, setIsSaving] = useState(false);

//   useEffect(() => {
//     if (questionData) {
//       setFormState({
//         questionText: questionData.text,
//         options: questionData.options,
//         correctAnswerIndex: questionData.correctAnswerIndex,
//       });
//     } else {
//       setFormState(initialFormState);
//     }
//   }, [questionData, isOpen]);

//   const handleOptionChange = (index: number, value: string) => {
//     const newOptions = [...formState.options];
//     newOptions[index] = value;
//     setFormState((prev) => ({ ...prev, options: newOptions }));
//   };

//   const handleSubmit = async () => {
//     setIsSaving(true);
//     const isEditing = !!questionData;
//     const apiUrl = isEditing
//       ? `/api/admin/question/${questionData._id}`
//       : `/api/admin/question`;
//     const method = isEditing ? "PUT" : "POST";

//     const payload = isEditing ? formState : { ...formState, quizId };

//     const saveToast = toast.loading(
//       isEditing ? "Updating question..." : "Adding question..."
//     );
//     try {
//       const response = await fetch(apiUrl, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       if (!response.ok) throw new Error("Failed to save question.");

//       toast.success("Question saved!", { id: saveToast });
//       onSave();
//       onClose();
//     } catch (error) {
//       toast.error("Failed to save question.");
//       console.log("Error : ", error);
//       //   toast.error(error.message || "Failed to save.", { id: saveToast });
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[600px]">
//         <DialogHeader>
//           <DialogTitle>
//             {questionData ? "Edit Question" : "Add New Question"}
//           </DialogTitle>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="grid gap-2">
//             <Label htmlFor="questionText">Question</Label>
//             <Textarea
//               id="questionText"
//               value={formState.questionText}
//               onChange={(e) =>
//                 setFormState((prev) => ({
//                   ...prev,
//                   questionText: e.target.value,
//                 }))
//               }
//             />
//           </div>
//           <div className="grid gap-2">
//             <Label>Options (select the correct one)</Label>
//             <RadioGroup
//               value={String(formState.correctAnswerIndex)}
//               onValueChange={(val) =>
//                 setFormState((prev) => ({
//                   ...prev,
//                   correctAnswerIndex: Number(val),
//                 }))
//               }
//             >
//               {formState.options.map((opt, index) => (
//                 <div key={index} className="flex items-center gap-2">
//                   <RadioGroupItem
//                     value={String(index)}
//                     id={`option-${index}`}
//                   />
//                   <Input
//                     value={opt}
//                     onChange={(e) => handleOptionChange(index, e.target.value)}
//                     placeholder={`Option ${index + 1}`}
//                   />
//                 </div>
//               ))}
//             </RadioGroup>
//           </div>
//         </div>
//         <DialogFooter>
//           <Button variant="outline" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button onClick={handleSubmit} disabled={isSaving}>
//             {isSaving ? "Saving..." : "Save Question"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// components/admin/questionModal.tsx
import React, { useState, useEffect } from "react";
import { IQuestion } from "@/type/type";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizId: string;
  questionData: IQuestion | null; // null when creating, object when editing
  onSave: () => void;
}

const initialFormState = {
  questionText: "",
  options: ["", "", "", ""],
  correctAnswerIndex: 0,
};

export const QuestionModal = ({
  isOpen,
  onClose,
  quizId,
  questionData,
  onSave,
}: QuestionModalProps) => {
  const [formState, setFormState] = useState(initialFormState);
  const [isSaving, setIsSaving] = useState(false);
  const isEditing = !!questionData; // Check if we are editing or creating

  // Populate form when modal opens for edit, or reset for create
  useEffect(() => {
    if (isOpen) {
      // Only run effect when modal is opening
      if (questionData) {
        // Ensure options array always has 4 elements for the UI
        const options = [...questionData.options];
        while (options.length < 4) options.push("");
        setFormState({
          questionText: questionData.questionText,
          options: options,
          correctAnswerIndex: questionData.correctAnswerIndex ?? 0,
        });
      } else {
        setFormState(initialFormState);
      }
    }
  }, [questionData, isOpen]); // Depend on isOpen as well

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formState.options];
    newOptions[index] = value;
    setFormState((prev) => ({ ...prev, options: newOptions }));
  };

  const validateForm = () => {
    if (!formState.questionText.trim()) {
      toast.error("Question text cannot be empty.");
      return false;
    }
    if (formState.options.some((opt) => !opt.trim())) {
      toast.error("All options must be filled out.");
      return false;
    }
    if (
      formState.correctAnswerIndex < 0 ||
      formState.correctAnswerIndex >= formState.options.length
    ) {
      toast.error("Invalid correct answer selected.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    // --- URL LOGIC ---
    // POST (Create): Use static URL /api/admin/question (matches your backend)
    // PUT (Edit): Use dynamic URL /api/admin/question/[questionId] (standard REST)
    const apiUrl = isEditing
      ? `/api/admin/quiz/${quizId}/questions/${questionData._id}` // For PUT
      : `/api/admin/quiz/questions`; // For POST

    const method = isEditing ? "PUT" : "POST";

    // --- PAYLOAD LOGIC ---
    // POST (Create): Include quizId in the body (matches your backend)
    // PUT (Edit): Only send the question fields, ID is in the URL.
    const payload = isEditing
      ? formState // Body for PUT
      : { ...formState, quizId: quizId }; // Body for POST <-- quizId included here

    const saveToast = toast.loading(
      isEditing ? "Updating question..." : "Adding question..."
    );

    try {
      const response = await fetch(apiUrl, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // <-- Use the correct payload
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save question.");
      }

      toast.success(`Question ${isEditing ? "updated" : "added"}!`, {
        id: saveToast,
      });
      onSave(); // Refresh data in parent
      onClose(); // Close modal
    } catch (error) {
      console.error("Save Question Error:", error);
      //   toast.error(error.message || "Failed to save.", { id: saveToast });
      toast.error("Failed to save question.", { id: saveToast });
    } finally {
      setIsSaving(false);
    }
  };

  // Ensure state is reset and saving flag is off when closing
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsSaving(false);
      // setFormState(initialFormState); // Resetting here can cause flicker, useEffect handles it better on open
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* Content remains the same */}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Question" : "Add New Question"}
          </DialogTitle>
          <DialogDescription>
            Fill in the question, provide 4 options, and select the correct
            answer.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="questionText">Question</Label>
            <Textarea
              id="questionText"
              value={formState.questionText}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  questionText: e.target.value,
                }))
              }
              disabled={isSaving}
            />
          </div>
          <div className="grid gap-2">
            <Label>Options (select the correct one)</Label>
            <RadioGroup
              disabled={isSaving}
              value={String(formState.correctAnswerIndex)}
              onValueChange={(val) =>
                setFormState((prev) => ({
                  ...prev,
                  correctAnswerIndex: Number(val),
                }))
              }
            >
              {formState.options.map((opt, index) => (
                <div key={index} className="flex items-center gap-2">
                  <RadioGroupItem
                    value={String(index)}
                    id={`option-${index}`}
                  />
                  <Input
                    disabled={isSaving}
                    value={opt}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving
              ? "Saving..."
              : isEditing
              ? "Save Changes"
              : "Add Question"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
