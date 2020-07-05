from django.shortcuts import render
from django.shortcuts import HttpResponse
from .user import User, All_voc, Review, connectDB
from sqlalchemy.sql import operators
import json
from sqlalchemy.orm import join


def row2dict(row):
    d = {}
    for column in row.__table__.columns:
        d[column.name] = str(getattr(row, column.name))
    return d


# 登录页面
def login(request):
    # 指定要访问的页面，render的功能：讲请求的页面结果提交给客户端
    return render(request, 'login.html')


# 注册页面
def register(request):
    return render(request, 'register.html')

# 设置页面
def setting(request):
    return render(request, 'setting.html',{"vocab_type": json.dumps('六级词库'),"plan_num": json.dumps(30)})

def save_set(request):
    type = {1: '四级词汇', 2: '六级词汇', 3: '托福词汇', 4: 'GRE词汇'}
    a = request.POST  # 获取post()请求
    # print(a)
    # 通过get()请求获取前段提交的数据
    newpwd = a.get('password')
    vocab_type = a.get('vocab_type')
    plan_num = a.get('plan_num')

    # newpwd = 'wangjing721'
    # vocab_type = a.get()
    # plan_num = a.get('plan_num')

    dburl = 'mysql+mysqlconnector://root:w721721J@localhost:3306/voc'
    DBSession = connectDB(dburl)
    session = DBSession()
    userName = request.session.get('user_id')
    user = session.query(User).filter(User.user_id == userName).all()
    user.sel_thesaurus = vocab_type
    user.plan_vocnum = plan_num
    if not newpwd:
        user.user_pwd = newpwd
    session.commit()
    session.close()

# 定义一个函数，用来保存注册的数据
def save(request):
    a = request.GET  # 获取get()请求
    # print(a)
    # 通过get()请求获取前段提交的数据
    userName = a.get('username')
    passWord = a.get('password')

    dburl = 'mysql+mysqlconnector://root:w721721J@localhost:3306/voc'
    DBSession = connectDB(dburl)
    session = DBSession()

    users = session.query(User).filter(User.user_id == userName).all()
    i = 0
    for item in users:
        if item:
            # 表示该账号已经存在
            session.close()
            return HttpResponse('该账号已存在')
    new_user = User(user_id=userName, user_pwd=passWord)
    # 添加到session:
    session.add(new_user)
    # 提交即保存到数据库:
    session.commit()
    # 关闭session:
    session.close()
    return HttpResponse('注册成功')


def query(request):
    a = request.POST
    userName = a.get('username')
    passWord = a.get('password')
    request.session['user_id'] = userName
    # 创建session对象:
    dburl = 'mysql+mysqlconnector://root:w721721J@localhost:3306/voc'
    DBSession = connectDB(dburl)
    session = DBSession()
    print(userName)
    try:
        user = session.query(User).filter(User.user_id == userName).one()
    except Exception:
        return HttpResponse("no such user")
    finally:
        session.close()

    if user.user_pwd == passWord:
        return HttpResponse("success")
    else:
        return HttpResponse("password not correct")
    session.close()


def recite(request):
    # 指定要访问的页面，render的功能：讲请求的页面结果提交给客户端
    return render(request, 'recite.html')


def recitevoc(request):
    type = {1: '四级词汇', 2: '六级词汇', 3: '托福词汇', 4: 'GRE词汇'}
    a = request.GET
    dburl = 'mysql+mysqlconnector://root:w721721J@localhost:3306/voc'
    DBSession = connectDB(dburl)
    session = DBSession()
    userName = request.session.get('user_id')
    user = session.query(User).filter(User.user_id == userName).one()
    recite_dict= []  # 背诵列表
    review_dict = []  # 复习列表
    review_num = 0
    # 处理要背诵的单词
    recitevoc = session.query(All_voc).filter(operators.op(All_voc.thesaurus, '&', user.sel_thesaurus)).all()
    # print("recite: {}".format(recitevoc[0].__class__))
    for i in range(user.plan_vocnum):
        voc_dict0 = row2dict(recitevoc[user.com_vocnum + i])
        print(voc_dict0)
        voc_dict = {}
        voc_dict['id'] = voc_dict0['voc_id']
        voc_dict['word'] = voc_dict0['spelling']
        voc_dict['pron'] = voc_dict0['pronunciation']
        voc_dict['word'] = voc_dict0['spelling']
        voc_dict['correct'] = voc_dict0['translation']
        voc_dict['index'] = 0
        #voc_dict = row2dict(recitevoc[user.com_vocnum + i])
        #voc_dict['index'] = 0
        recite_dict.append(voc_dict)  ## 使用 append() 添加元素

    # 处理要复习的单词
    reviewvoc = session.query(All_voc.voc_id, All_voc.spelling, All_voc.pronunciation, All_voc.translation, \
                              Review.index).filter(All_voc.voc_id == Review.voc_id, Review.user_id == userName).all()
    # print("review : {}".format(reviewvoc[0].__class__))
    for item in reviewvoc:
        if item.index > 3.0:
            item_dict = {}
            item_dict["id"] = item[0]
            item_dict["word"] = item[1]
            item_dict["pron"] = item[2]
            item_dict["correct"] = item[3]
            item_dict["index"] = item[4]
            # print((item))
            # print(item.voc_id)
            # print(item.spelling)
            review_dict.append(item_dict)  ## 使用 append() 添加元素
            review_num += 1
    session.close()
    # print(review_list)
    words = {}
    words['vocab_type'] = type[user.sel_thesaurus]  # 词库种类
    words['review_num'] = review_num  # 复习单词个数
    words['recite_num'] = user.plan_vocnum  # 背诵单词个数
    words['review'] = review_dict   # 复习但系
    words['recite'] = recite_dict  #背诵单词
    print(words)
    return HttpResponse(words)

def setup(request):
    a = request.GET
    newpwd= a.get('passward')
    newtype = a.get('voctype')
    dburl = 'mysql+mysqlconnector://root:w721721J@localhost:3306/voc'
    DBSession = connectDB(dburl)
    session = DBSession()
    userName = request.session.get('user_id')
    user = session.query(User).filter(User.user_id == userName).one()


'''
def test(request):
    a = request.GET
    dburl = 'mysql+mysqlconnector://root:w721721J@localhost:3306/voc'
    DBSession = connectDB(dburl)
    session = DBSession()
    userName = request.session.get('user_id')
    user = session.query(User).filter(User.user_id == userName).one()

'''
