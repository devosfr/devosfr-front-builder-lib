
<template>
    <div class="flex flex-wrap gap-8">
        <div class="flex-auto">
            <h5>Label</h5>
            <Avatar label="P" class="mr-2" size="xlarge" />
            <Avatar label="V" class="mr-2" size="large" style="background-color: #ece9fc; color: #2a1261" />
            <Avatar label="U" class="mr-2" style="background-color: #dee9fc; color: #1a2551" />
        </div>

        <div class="flex-auto">
            <h5>Circle</h5>
            <Avatar label="P" class="mr-2" size="xlarge" shape="circle" />
            <Avatar label="V" class="mr-2" size="large" style="background-color: #ece9fc; color: #2a1261" shape="circle" />
            <Avatar label="U" class="mr-2" style="background-color: #dee9fc; color: #1a2551" shape="circle" />
        </div>

        <div class="flex-auto">
            <h5>Badge</h5>
            <OverlayBadge value="4" severity="danger" class="inline-flex">
                <Avatar label="U" size="xlarge" />
            </OverlayBadge>
        </div>
    </div>
</template>

<script setup>

</script>
