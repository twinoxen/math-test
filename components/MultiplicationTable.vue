<template>
  <section class="px-0 sm:px-4">
    <div class="w-full max-w-6xl mx-auto">
      <!-- Header Card -->
      <div class="card p-6 sm:p-8 mb-8 animate-scale-in">
        <h2 class="text-2xl sm:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          📊 Multiplication Table
        </h2>
        
        <div class="print-hide">
          <div class="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-6">
            <span class="text-base sm:text-lg font-medium text-gray-700 mb-2 sm:mb-0">Practice Range:</span>
            <div class="flex items-center gap-2 sm:gap-3">
              <input
                class="input w-14 sm:w-16 md:w-20 text-center"
                v-model.number="multiplicationMin"
                placeholder="0"
                type="text"
                pattern="[0-9]*"
              />
              <span class="text-gray-500 font-medium text-sm">to</span>
              <input
                class="input w-14 sm:w-16 md:w-20 text-center"
                v-model.number="multiplicationMax"
                placeholder="10"
                type="text"
                pattern="[0-9]*"
              />
            </div>
          </div>
          
          <div class="text-center text-sm text-gray-600 mb-4">
            💡 Fill in the multiplication table below. Correct answers will turn green!
          </div>
        </div>
      </div>

      <!-- Multiplication Table -->
      <div class="card p-4 sm:p-6 animate-scale-in overflow-hidden">
        <div class="overflow-x-auto">
          <div class="inline-block min-w-full">
            <!-- Table Container -->
            <div class="flex">
              <!-- Y-axis (left column) -->
              <div class="flex flex-col">
                <div
                  v-for="(parentItem, index) in multiplicationNumbersRange"
                  :key="`y-axis-${parentItem}`"
                  :class="{
                    'bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300 text-purple-700': index === 0,
                    'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:bg-blue-100': index !== 0
                  }"
                  class="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center text-xs sm:text-sm md:text-base font-semibold border-2 transition-all duration-300"
                >
                  {{ index === 0 ? '×' : index }}
                </div>
              </div>

              <!-- Main table area -->
              <div class="flex-1">
                <!-- X-axis (top row) -->
                <div class="flex">
                  <div
                    v-for="(parentItem, index) in multiplicationNumbersRange.slice(1)"
                    :key="`x-axis-${parentItem}`"
                    class="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center text-xs sm:text-sm md:text-base font-semibold bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 text-blue-700 hover:bg-blue-100 transition-all duration-300"
                  >
                    {{ index + 1 }}
                  </div>
                </div>

                <!-- Input grid -->
                <div
                  v-for="parentIndex in multiplicationNumbersRange.slice(1)"
                  :key="`row-${parentIndex}`"
                  class="flex"
                >
                  <div
                    v-for="(childIndex, index) in multiplicationNumbersRange.slice(1)"
                    :key="`input-${parentIndex}-${childIndex}`"
                    class="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 bg-white"
                  >
                    <input
                      class="w-full h-full text-center font-medium border-none bg-transparent focus:bg-blue-50 transition-all duration-300 hover:bg-gray-50"
                      style="font-size: 16px"
                      @input="handleMultiplicationInput(parentIndex, childIndex, $event)"
                      data-multiplication="true"
                      pattern="[0-9]*"
                      placeholder=""
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Progress indicator -->
        <div class="mt-6 print-hide">
          <div class="text-center text-sm text-gray-600 mb-2">
            Keep going! Each correct answer brings you closer to mastery 🌟
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              :style="{ width: progressPercent + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Tips Card -->
      <div class="card p-6 mt-8 animate-fade-in print-hide">
        <h3 class="text-lg font-semibold text-gray-700 mb-4">💡 Multiplication Tips</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
          <div class="space-y-2">
            <p>• Start with the easier ones (2×, 5×, 10×)</p>
            <p>• Use patterns: 9× numbers always add up to 9</p>
            <p>• Remember: 6×7 = 42, 6×8 = 48</p>
          </div>
          <div class="space-y-2">
            <p>• Practice a little bit every day</p>
            <p>• Use your fingers for 9× tables</p>
            <p>• Double-check your work</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const multiplicationMin = ref(0)
const multiplicationMax = ref(10)
const multiplicationNumbersRange = ref<number[]>([])
const correctCount = ref(0)

const progressPercent = computed(() => {
  if (process.client) {
    const total = (multiplicationNumbersRange.value.length - 1) ** 2
    const correct = document.querySelectorAll('.input-correct').length
    return total > 0 ? (correct / total) * 100 : 0
  }
  return 0
})

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

const focusNextInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input) return

  const allInputs = document.querySelectorAll('input[data-multiplication]')
  const currentIndex = Array.from(allInputs).indexOf(input)

  if (currentIndex === allInputs.length - 1) return

  const nextInput = allInputs[currentIndex + 1] as HTMLInputElement
  nextInput.focus()
}

const setMultiRange = () => {
  if (
    multiplicationMin.value >= multiplicationMax.value ||
    isNaN(multiplicationMin.value) ||
    isNaN(multiplicationMax.value)
  )
    return

  const range: number[] = []
  for (let index = multiplicationMin.value; index < multiplicationMax.value + 1; index++) {
    range.push(index)
  }

  multiplicationNumbersRange.value = range
}

const validateMultiplicationInput = (value: number, column: number, row: number) => {
  return value === column * row
}

const handleMultiplicationInput = (column: number, row: number, event: Event) => {
  if (!onlyNumber(event)) {
    return
  }

  const target = event.target as HTMLInputElement
  const input = parseInt(target.value)

  if (!validateMultiplicationInput(input, column, row)) {
    target.classList.add('animate-incorrect')
    target.classList.remove('input-correct')
    target.classList.add('input-incorrect')
    setTimeout(() => target.classList.remove('animate-incorrect'), 500)
    return
  }

  target.classList.add('animate-correct')
  target.classList.remove('input-incorrect')
  target.classList.add('input-correct')
  setTimeout(() => target.classList.remove('animate-correct'), 600)
  focusNextInput(event)
}

watch([multiplicationMin, multiplicationMax], () => {
  setMultiRange()
})

onMounted(() => {
  setMultiRange()
})
</script>

