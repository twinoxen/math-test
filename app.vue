<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
    <!-- Header -->
    <header class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
      <div class="relative container mx-auto px-4 py-8 sm:py-12">
        <div class="text-center animate-fade-in">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Math Practice Hub
          </h1>
          <p class="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Master your math skills with interactive problems and multiplication tables. 
            Practice makes perfect! 🧮✨
          </p>
          
          <!-- Tab Navigation -->
          <div class="inline-flex bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20 w-full max-w-md mx-auto">
            <button
              @click="activeTab = 'problems'"
              :class="{
                'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md transform scale-105': activeTab === 'problems',
                'text-gray-600 hover:text-gray-800 hover:bg-white/50': activeTab !== 'problems'
              }"
              class="flex-1 px-3 sm:px-6 py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base"
            >
              <span class="hidden sm:inline">🎯 Problem Generator</span>
              <span class="sm:hidden">🎯 Problems</span>
            </button>
            <button
              @click="activeTab = 'table'"
              :class="{
                'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md transform scale-105': activeTab === 'table',
                'text-gray-600 hover:text-gray-800 hover:bg-white/50': activeTab !== 'table'
              }"
              class="flex-1 px-3 sm:px-6 py-3 rounded-xl font-medium transition-all duration-300 text-sm sm:text-base"
            >
              <span class="hidden sm:inline">📊 Multiplication Table</span>
              <span class="sm:hidden">📊 Table</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-0 sm:px-4 pb-12">
      <div class="animate-fade-in">
        <div v-if="activeTab === 'problems'" class="animate-slide-in">
          <ProblemGenerator />
        </div>
        <div v-if="activeTab === 'table'" class="animate-slide-in">
          <MultiplicationTable />
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="print-hide bg-white/50 backdrop-blur-sm border-t border-white/20 mt-12">
      <div class="container mx-auto px-4 py-6">
        <div class="text-center text-gray-600">
          <p class="text-sm">
            Keep practicing and you'll become a math wizard! 🧙‍♂️✨
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const activeTab = ref<'problems' | 'table'>('problems')
</script>

