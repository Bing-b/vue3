<template>
  <div class="commit-stats-container w-[800px] relative flex h-full gap-4 p-4 pr-0">
    <!-- 左侧：个人信息 -->
    <div class="w-1/3 min-w-[240px]">
      <ProfileCard />
    </div>

    <!-- 右侧：活动与仓库 -->
    <div class="flex flex-1 flex-col gap-4">
      <!-- 提交统计热力图 -->
      <div class="flex-1 overflow-hidden">
        <ContributionHeatmap />
      </div>
      
      <!-- 热门仓库 -->
      <div class="flex-1 overflow-hidden">
        <RepoList :repos="repos" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getGitHubProject } from '@/api/common';
import ProfileCard from './github/ProfileCard.vue';
import ContributionHeatmap from './github/ContributionHeatmap.vue';
import RepoList from './github/RepoList.vue';

const repos = ref<any[]>([]);

const initData = async () => {
  try {
    const reposRes = await getGitHubProject();
    // 简单按 star 排序取前 10
    repos.value = (reposRes.data || [])
      .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
      .slice(0, 10);
      
  } catch (error) {
    console.error('GitHub API Error:', error);
  }
};

onMounted(() => {
  initData();
});
</script>

<style scoped>

</style>
