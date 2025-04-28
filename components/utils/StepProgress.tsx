const steps = [1, 2, 3]; // Just step numbers, no labels

const StepProgress = ({ currentStep = 1 }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step;
        const isActive = currentStep === step;

        return (
          <div key={step} className="flex items-center">
            {/* Step circle */}
            <div
              className={`
                 rounded-full flex items-center justify-center p-2 w-6 h-6
                ${
                  isCompleted
                    ? "bg-green-600 "
                    : isActive
                    ? "border-2 border-[#15436D] bg-white"
                    : "bg-gray-400"
                }
              `}
            >
                <p className={`font-medium ${isActive? 'text-[#15436D]': 'text-white'}`}>
                    {step}
                </p>
            </div>

            {/* Line between steps */}
            {index < steps.length - 1 && (
              <div className="w-6 h-0.5 bg-gray-300 mx-1"></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StepProgress;
