// import { NotificationParams, NotificationHandler } from 'element-plus';

let notificationModule = null;
export async function useElNotification(options) {
    if (process.server) {
        console.warn('ElNotification 不能在服务端调用')
        return { close: () => {} }
    }
    // 如果已经加载过，直接使用
    if (notificationModule) {
        return notificationModule(options)
    }

    // 动态导入 ElNotification 和它的样式
    const [ElNotificationModule] = await Promise.all([
        import('element-plus/es/components/notification/index.mjs'),
        import('element-plus/theme-chalk/el-notification.css')
    ])
    // const ElNotificationModule = {default: (options) => {}};
    console.log(ElNotificationModule);
    notificationModule = ElNotificationModule.default;

    // 调用通知
    return notificationModule(options)
}

// 封装快捷方法，与原生 ElNotification 用法一致
useElNotification.success = (message) => {
  return useElNotification(typeof message === 'string' 
    ? { message, type: 'success' } 
    : { ...message, type: 'success' }
  )
}

useElNotification.error = (message) => {
  return useElNotification(typeof message === 'string' 
    ? { message, type: 'error' } 
    : { ...message, type: 'error' }
  )
}

useElNotification.closeAll = () => {
  if (notificationModule) {
    notificationModule.closeAll()
  }
}
