"""Django01 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from untitled import views

urlpatterns = [
    path('admin/', admin.site.urls),#系统默认创建的
    path('login/',views.login),#用于打开登录页面
    path('recite/',views.recite),#用于打开登录页面
    path('recite/recitevoc',views.recitevoc),#用于打开登录页面
    path('register/',views.register),#用于打开注册页面
    path('register/save',views.save),#输入用户名密码后交给后台save函数处理
    path('login/query',views.query),#输入用户名密码后交给后台query函数处理
    path('setting/',views.setting),#用于打开登录页面
    path('setting/saveset',views.save_set)#用于打开登录页面
]

