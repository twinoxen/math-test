<template>
  <section class="flex flex-col justify-center items-center px-0 sm:px-4">
    <div class="w-full max-w-4xl">
      <!-- Settings Card -->
      <div class="card p-6 sm:p-8 mb-8 animate-scale-in">
        <h2 class="print-hide text-2xl sm:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🎯 Problem Generator
        </h2>

        <div class="print-hide space-y-8">
          <!-- Problem Types -->
          <div class="animate-slide-in">
            <h3 class="text-lg font-semibold mb-4 text-gray-700">Problem Types</h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div
                v-for="(type, index) in problemType"
                :key="index"
                @click="handleProblemType(index)"
                :class="{
                  'border-blue-400 bg-blue-50 shadow-md': type.checked,
                  'border-gray-200 bg-white hover:border-gray-300': !type.checked
                }"
                class="relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105"
              >
                <!-- Hidden checkbox for accessibility -->
                <input
                  name="problemType"
                  type="checkbox"
                  :checked="type.checked"
                  :value="type.symbol"
                  class="sr-only"
                  :aria-label="type.name"
                  @change.stop
                />
                
                <!-- Green checkmark indicator in upper left -->
                <div
                  v-if="type.checked"
                  class="absolute -top-2 -left-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-scale-in"
                >
                  <svg class="w-4 h-4 text-white" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                
                <div class="flex items-center justify-center gap-2">
                  <span class="text-xl">{{ icons[type.symbol as keyof typeof icons] }}</span>
                  <label class="font-medium text-gray-700 cursor-pointer">
                    {{ type.name }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Settings Section -->
          <div class="space-y-6 animate-slide-in pb-4">
            <!-- Compact Settings Row -->
            <div class="bg-gradient-to-r from-purple-50 via-blue-50 to-green-50 p-6 rounded-2xl border-2 border-white/50 shadow-lg">
              <div class="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 flex-wrap">
                
                <!-- Number of Problems -->
                <div class="flex items-center gap-4 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div class="flex items-center gap-2">
                    <span class="text-2xl">🔢</span>
                    <span class="text-sm font-semibold text-gray-700 whitespace-nowrap">Problems</span>
                  </div>
                  <input
                    class="input text-center text-2xl font-bold w-20 h-12 bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300 rounded-xl shadow-sm focus:border-purple-500 focus:shadow-md transition-all duration-300"
                    v-model.number="numberOfProblems"
                    placeholder="10"
                    type="text"
                    pattern="[0-9]*"
                  />
                </div>

                <!-- Divider -->
                <div class="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

                <!-- Number Range -->
                <div class="flex items-center gap-4 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div class="flex items-center gap-2">
                    <span class="text-2xl">📏</span>
                    <span class="text-sm font-semibold text-gray-700 whitespace-nowrap">Range</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <input
                      class="input text-center text-2xl font-bold w-16 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-blue-300 rounded-xl shadow-sm focus:border-blue-500 focus:shadow-md transition-all duration-300"
                      v-model.number="problemMin"
                      placeholder="1"
                      type="text"
                      pattern="[0-9]*"
                    />
                    <span class="text-xl font-bold text-gray-400">-</span>
                    <input
                      class="input text-center text-2xl font-bold w-16 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-blue-300 rounded-xl shadow-sm focus:border-blue-500 focus:shadow-md transition-all duration-300"
                      v-model.number="problemMax"
                      placeholder="10"
                      type="text"
                      pattern="[0-9]*"
                    />
                  </div>
                </div>

                <!-- Divider -->
                <div class="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

                <!-- Timer -->
                <div class="flex items-center gap-4 bg-white/80 backdrop-blur-sm px-6 py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer" @click="handlePauseResume">
                  <div class="flex items-center gap-2">
                    <span class="text-2xl">⏱️</span>
                    <span class="text-sm font-semibold text-gray-700 whitespace-nowrap">Timer</span>
                  </div>
                  <div class="flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-2 rounded-lg">
                    <Time :time="time" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Generate Button -->
            <div class="flex justify-center pb-2">
              <button
                class="btn btn-success px-12 py-5 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                @click="generateProblems"
              >
                <span class="text-xl mr-2">🚀</span>
                Generate Problems
              </button>
            </div>
          </div>
        </div>

        <div
          v-if="problemType.find(type => type.name === 'Division' && type.checked)"
          class="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg animate-fade-in"
        >
          <p class="text-sm text-yellow-800">
            💡 <strong>Division tip:</strong> Round to the nearest hundredth (e.g., 1.03)
          </p>
        </div>
      </div>

      <!-- Problems Grid -->
      <div v-if="generatedProblems.length > 0" class="card p-6 sm:p-8 animate-scale-in">
        <h3 class="text-xl font-semibold text-center mb-6 text-gray-700">
          Solve These Problems! 🧮
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="(problem, index) in generatedProblems"
            :key="`problem-${index}`"
            class="glass-card p-4 rounded-xl hover:scale-105 transition-all duration-300 animate-fade-in"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="text-lg font-medium text-gray-700">
                {{ `${problem.left} ${readableType(problem.type)} ${problem.right} =` }}
              </div>
              <div class="flex items-center gap-2">
                <div v-if="problem.elapsed" class="flex items-center gap-1 text-xs text-green-600 font-medium animate-fade-in">
                  <img
                    src="/timer-icon.svg"
                    alt="timer"
                    width="12"
                    height="12"
                  />
                  <Time :time="problem.elapsed" />
                </div>
                <input
                  :ref="el => { if (el) problemRefs[index] = el as HTMLInputElement }"
                  class="input w-16 sm:w-20 text-center font-medium"
                  @input="handleProblemInput(problem, $event)"
                  pattern="[0-9]*"
                  placeholder="?"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div
          v-if="generatedProblems.every(problem => problem.passed) && generatedProblems.length > 0"
          class="mt-8 text-center animate-bounce"
        >
          <div class="text-4xl mb-2">🎉</div>
          <p class="text-xl font-semibold text-green-600">
            Congratulations! You solved all problems!
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Problem {
  left: number
  right: number
  type: string
  passed?: boolean
  time?: number
  elapsed?: number
}

const icons = { '+': '➕', '-': '➖', '*': '✖️', '/': '➗' }

const generatedProblems = ref<Problem[]>([])
const problemType = ref([
  { name: 'Addition', symbol: '+', checked: true },
  { name: 'Subtraction', symbol: '-', checked: false },
  { name: 'Multiplication', symbol: '*', checked: false },
  { name: 'Division', symbol: '/', checked: false },
])
const numberOfProblems = ref(10)
const problemMin = ref(1)
const problemMax = ref(10)

const problemRefs = ref<HTMLInputElement[]>([])

const time = ref(0)
const lastTime = ref(0)
const isActive = ref(false)
const isPaused = ref(true)
let interval: ReturnType<typeof setInterval> | null = null

const onlyNumber = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.value === '' && !/^[0-9\b]+$/.test(target.value)) {
    target.classList.remove('input-incorrect')
    target.classList.add('input')
    target.value = target.value.replace(/[a-zA-Z;:\/\?]/gm, '')
    return false
  }
  return true
}

const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min)
}

const readableType = (type: string) => {
  const map: { [key: string]: string } = {
    '+': '+',
    '-': '-',
    '*': '×',
    '/': '÷',
  }
  return map[type]
}

const focusNextInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input) return

  const allInputs = document.querySelectorAll('input[pattern="[0-9]*"]')
  const currentIndex = Array.from(allInputs).indexOf(input)

  if (currentIndex === allInputs.length - 1) return

  const nextInput = allInputs[currentIndex + 1] as HTMLInputElement
  nextInput.focus()
}

const generateProblems = () => {
  if (problemMin.value >= problemMax.value || isNaN(problemMin.value) || isNaN(problemMax.value))
    return

  handleReset()
  handleStart()

  const problems: Problem[] = []
  const selectedProblemTypes = problemType.value.filter((type) => type.checked)

  for (let index = 0; index < numberOfProblems.value; index++) {
    const left = randomNumber(problemMin.value, problemMax.value)
    const right = randomNumber(problemMin.value, problemMax.value)

    problems.push({
      left,
      right,
      type: selectedProblemTypes[
        Math.floor(Math.random() * selectedProblemTypes.length)
      ].symbol,
    })
  }

  generatedProblems.value = problems
}

const getAnswer = (problem: Problem): number | null => {
  let result: number | null = null

  switch (problem.type) {
    case '+':
      result = problem.left + problem.right
      break
    case '-':
      result = problem.left - problem.right
      break
    case '*':
      result = problem.left * problem.right
      break
    case '/':
      result = problem.left / problem.right
      break
  }

  return result ?? null
}

const isCorrect = (input: number, answer: number | null) => {
  return Math.abs(input).toFixed(2) === Math.abs(answer ?? 0)?.toFixed(2)
}

const handleProblemType = (index: number) => {
  problemType.value[index].checked = !problemType.value[index].checked
}

const handleProblemInput = (problem: Problem, event: Event) => {
  if (!onlyNumber(event)) {
    return
  }

  if (isPaused.value) handlePauseResume()

  const target = event.target as HTMLInputElement
  const input = parseFloat(target.value)

  const answer = getAnswer(problem)
  if (!isCorrect(input, answer)) {
    target.classList.add('animate-incorrect')
    target.classList.remove('input-correct')
    target.classList.add('input-incorrect')
    setTimeout(() => target.classList.remove('animate-incorrect'), 500)
    return
  }

  if (answer && answer < 0) {
    target.value = `-${input}`
  }

  problem.passed = true
  problem.time = time.value
  problem.elapsed = lastTime.value > 0 ? time.value - lastTime.value : time.value

  lastTime.value = time.value

  target.classList.add('animate-correct')
  target.classList.remove('input-incorrect')
  target.classList.add('input-correct')
  setTimeout(() => target.classList.remove('animate-correct'), 600)

  focusNextInput(event)

  if (
    generatedProblems.value.length &&
    generatedProblems.value.every((problem) => problem.passed === true) &&
    !isPaused.value
  ) {
    handlePauseResume()
  }
}

const handleStart = () => {
  isActive.value = true
  isPaused.value = false
}

const handlePauseResume = () => {
  isPaused.value = !isPaused.value
}

const handleReset = () => {
  isActive.value = false
  time.value = 0
}

watch(generatedProblems, () => {
  nextTick(() => {
    problemRefs.value.forEach((item) => {
      if (!item) return
      item.value = ''
      item.classList.remove('input-correct', 'input-incorrect')
      item.classList.add('input')
    })
  })
})

watch([isActive, isPaused], () => {
  if (interval) clearInterval(interval)
  
  if (isActive.value && isPaused.value === false) {
    interval = setInterval(() => {
      time.value += 10
    }, 10)
  }
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

