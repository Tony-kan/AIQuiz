// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { toast } from "sonner";

// interface AiGenerationDialogProps {
//   isOpen: boolean;
//   onClose: () => void;
//   quizId: string;
//   quizTopic: string;
//   onFinish: () => void;
// }

// export const AiGenerationDialog = ({
//   isOpen,
//   onClose,
//   quizId,
//   quizTopic,
//   onFinish,
// }: AiGenerationDialogProps) => {
//   const [numQuestions, setNumQuestions] = useState(5);
//   const [context, setContext] = useState("");
//   const [isGenerating, setIsGenerating] = useState(false);

//   const handleGenerate = async () => {
//     setIsGenerating(true);
//     const genToast = toast.loading(
//       "AI is generating questions... This may take a moment."
//     );
//     try {
//       const response = await fetch(
//         `/api/admin/quiz/${quizId}/generate-questions`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ numberOfQuestions: numQuestions, context }),
//         }
//       );
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to generate questions.");
//       }

//       toast.success("AI questions generated successfully!", { id: genToast });
//       onFinish();
//       onClose();
//     } catch (error) {
//       //   toast.error(error.message, { id: genToast });
//       toast.error("Failed to generate questions.");
//       console.log("Error : ", error);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Generate Questions with AI</DialogTitle>
//           <DialogDescription>
//             Based on the quiz topic:{" "}
//             <span className="font-semibold">{quizTopic}</span>
//           </DialogDescription>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="grid gap-2">
//             <Label htmlFor="numQuestions">Number of Questions</Label>
//             <Input
//               id="numQuestions"
//               type="number"
//               value={numQuestions}
//               onChange={(e) => setNumQuestions(Number(e.target.value))}
//             />
//           </div>
//           <div className="grid gap-2">
//             <Label htmlFor="context">Additional Context (Optional)</Label>
//             <Textarea
//               id="context"
//               placeholder="Provide any specific text, keywords, or context for the AI to use..."
//               value={context}
//               onChange={(e) => setContext(e.target.value)}
//             />
//           </div>
//         </div>
//         <DialogFooter>
//           <Button variant="outline" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button onClick={handleGenerate} disabled={isGenerating}>
//             {isGenerating ? "Generating..." : "Generate"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// components/admin/aiGenerationDialog.tsx
import React, { useState } from "react";
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
import { toast } from "sonner";

interface AiGenerationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  quizId: string;
  quizTopic: string;
  onFinish: () => void;
}

export const AiGenerationDialog = ({
  isOpen,
  onClose,
  quizId,
  quizTopic,
  onFinish,
}: AiGenerationDialogProps) => {
  const [numQuestions, setNumQuestions] = useState(5);
  const [context, setContext] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    // Basic validation
    if (!quizId) {
      toast.error("Quiz ID is missing, cannot generate.");
      return;
    }
    if (numQuestions < 1 || numQuestions > 20) {
      toast.error("Please enter a number of questions between 1 and 20.");
      return;
    }

    setIsGenerating(true);
    const genToast = toast.loading(
      "AI is generating questions... This may take a moment."
    );

    // --- CHANGE 1: Define the static API endpoint ---
    // Assumes your backend file is at /app/api/admin/generate-questions/route.ts
    const API_URL = `/api/admin/quiz/generate-questions`;

    // --- CHANGE 2: Include quizId in the payload body ---
    const payload = {
      quizId: quizId, // <-- ADD quizId HERE
      numberOfQuestions: numQuestions,
      context: context,
    };

    try {
      // --- CHANGE 3: Use the static URL and the new payload ---
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // <-- USE payload
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Use backend error message if available
        throw new Error(errorData.message || "Failed to generate questions.");
      }

      toast.success("AI questions generated successfully!", { id: genToast });
      onFinish(); // Refreshes data in parent
      onClose(); // Closes modal
    } catch (error) {
      console.error("AI Generation Error:", error);
      //   toast.error(error.message || "An unexpected error occurred.", {
      //     id: genToast,
      //   });
      toast.error("An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Reset state when modal closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setNumQuestions(5);
      setContext("");
      setIsGenerating(false); // Ensure loading state is reset
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* Content remains the same */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Questions with AI</DialogTitle>
          <DialogDescription>
            Based on the quiz topic:{" "}
            <span className="font-semibold">{quizTopic}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="numQuestions">Number of Questions</Label>
            <Input
              id="numQuestions"
              type="number"
              min="1"
              max="20"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              disabled={isGenerating}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="context">Additional Context (Optional)</Label>
            <Textarea
              id="context"
              placeholder="Provide any specific text, keywords, or context for the AI to use..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              disabled={isGenerating}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isGenerating}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
